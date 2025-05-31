
import React, { useState } from 'react';
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

const EstablishmentsPage = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([
    {
      id: '1',
      name: 'Restaurante Sabor & Arte',
      category: 'Restaurante',
      logo: '/placeholder.svg',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Farmácia Saúde Total',
      category: 'Farmácia',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Loja Fashion Style',
      category: 'Moda',
      createdAt: new Date()
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    logo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const categories = [
    'Restaurante',
    'Farmácia',
    'Moda',
    'Tecnologia',
    'Saúde',
    'Educação',
    'Serviços',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
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
      const newEstablishment: Establishment = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };
      setEstablishments([...establishments, newEstablishment]);
      toast({
        title: "Sucesso",
        description: "Estabelecimento cadastrado com sucesso!",
      });
    }

    setIsDialogOpen(false);
    setEditingEstablishment(null);
    setFormData({ name: '', category: '', logo: '' });
  };

  const handleEdit = (establishment: Establishment) => {
    setEditingEstablishment(establishment);
    setFormData({
      name: establishment.name,
      category: establishment.category,
      logo: establishment.logo || ''
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredEstablishments = establishments.filter(est =>
    est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estabelecimentos</h1>
          <p className="text-gray-600 mt-2">Gerencie os estabelecimentos cadastrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              setEditingEstablishment(null);
              setFormData({ name: '', category: '', logo: '' });
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
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  {formData.logo && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
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
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar estabelecimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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
                        {establishment.logo ? (
                          <img src={establishment.logo} alt={establishment.name} className="w-full h-full object-cover" />
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
                    Cadastrado em {establishment.createdAt.toLocaleDateString('pt-BR')}
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
      </Card>
    </div>
  );
};

export default EstablishmentsPage;
