
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Search, Edit, Image } from 'lucide-react';
import { Establishment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Pagination } from '@/components/Pagination';

const EstablishmentsPage = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);

  const [categories,setCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    logo_url: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingEstablishment) {

      const response = await handleUpdateEstablishment(formData);

      formData.logo_url = response?.updatedEstablishment?.logo_url;

      setEstablishments(establishments.map(est => 
        est.id === editingEstablishment.id 
          ? { ...est, ...formData }
          : est
      ));

      toast({
        title: "Sucesso",
        description: "Estabelecimento atualizado com sucesso!",
      });

    } else {

      const newEstablishment = await handleCreateEstablishment(formData);

      setEstablishments([...establishments, newEstablishment]);

      toast({
        title: "Sucesso",
        description: "Estabelecimento cadastrado com sucesso!",
      });

    }

    setIsDialogOpen(false);
    setEditingEstablishment(null);
    setFormData({ id: '',  name: '', category: '', logo_url: '' });
  };

  const handleEdit = (establishment: Establishment) => {

    setEditingEstablishment(establishment);

    setFormData({
      id: establishment.id,
      name: establishment.name,
      category: establishment.category,
      logo_url: establishment.logo_url || ''
    });

    setIsDialogOpen(true);
  };

  const filteredEstablishments = establishments.filter(est =>
    est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateEstablishment = async (establishment: Establishment) => {

    try {

      const formDataUpdate = new FormData();

      formDataUpdate.append('name', establishment.name);
      formDataUpdate.append('category', establishment.category);
      formDataUpdate.append('logo', establishment.logo_url);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/establishment/${establishment.id}`, {
        method: "PATCH",
        body: formDataUpdate,
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      }

      return false;

    } catch(error) {
      console.log("Erro ao atualizar estabelecimento");
    }
  };

  const handleCreateEstablishment = async (establishment: Establishment) => {

    try {

      const formData = new FormData();

      formData.append('name', establishment.name);
      formData.append('category', establishment.category);
      formData.append('logo', establishment.logo_url);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/establishment`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      }

      return false;

    } catch(error) {
      console.log("Erro ao atualizar estabelecimento");
    }

  };

  const handleCategoryChange = (value: string) => {
    if (value === "__new__") {
      setUseCustomCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setUseCustomCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  async function listEstablishments(category?:string) {

    try {
      const filterCategory = category && category !== "all" ? `&category=${category}` : "";
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/establishment?limit=9&page=${currentPage}${filterCategory}`, {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();

      setEstablishments(result?.establishments.rows);
      setTotalPages(Math.ceil((result.establishments.count || 0)/9))

    } catch(error) {
      console.log("Erro ao buscar estabelecimentos");
    }

  };

  useEffect(()=> {

    async function getCategories() {

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/establishment/category`, {method: "GET", credentials: 'include'});
      const result = await response.json();
      
      setCategories(result?.groupCategories);
      
    }

    getCategories();
    listEstablishments();

  }, []);

  useEffect(()=> {

    listEstablishments(selectedCategory);

  }, [selectedCategory]);

  useEffect(()=> {
    listEstablishments()
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estabelecimentos</h1>
          <p className="text-gray-600 mt-2">Gerencie os estabelecimentos cadastrados</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

          <DialogTrigger asChild>
            <Button className="bg-primary" onClick={() => {
              setEditingEstablishment(null);
              setFormData({ id: '', name: '', category: '', logo_url: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Estabelecimento
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEstablishment ? 'Editar' : 'Novo'} Estabelecimento
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do estabelecimento
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do estabelecimento"
                  required
                />
              </div>
              
              <div className="space-y-2">
                {!useCustomCategory && (
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="__new__">➕ Adicionar nova categoria...</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {useCustomCategory && (
                  <Input
                    placeholder="Digite a nova categoria"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e)=> setFormData({...formData, logo_url: e.target.files?.[0] || null})}
                    className="flex-1"
                  />
                  {formData.logo_url && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">

                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEstablishment ? 'Atualizar' : 'Cadastrar'}
                </Button>

              </div>
            </form>

          </DialogContent>

        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-72 flex items-center gap-4">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar estabelecimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                />
            </div>

            <div className="flex items-center flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="max-w-md w-72 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">
                  Selecione uma categoria
                </option>

                {categories.map((categorie, index) => (
                  <option key={index} value={categorie}>
                    {categorie}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEstablishments.map((establishment) => (
              <Card key={establishment.id} className="hover:shadow-lg transition-shadow duration-200">

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {establishment.logo_url ? (
                          <img src={typeof establishment.logo_url === "string" ? establishment.logo_url : null} alt={establishment.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <CardTitle className="text-lg">{establishment.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {establishment.category}
                        </Badge>
                      </div>

                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(establishment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-500">
                    Cadastrado em {new Date(establishment.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredEstablishments.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum estabelecimento encontrado' : 'Nenhum estabelecimento cadastrado'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece cadastrando seu primeiro estabelecimento'
                }
              </p>
            </div>
          )}
        </CardContent>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> 

      </Card>
    </div>
  );
};

export default EstablishmentsPage;
