
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Search, Edit, DollarSign, Gift } from 'lucide-react';
import { Voucher, Establishment } from '@/types';
import { useToast } from '@/hooks/use-toast';

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: '1',
      title: 'Desconto 20% em Pizzas',
      description: 'Desconto especial em todas as pizzas da casa',
      code: 'PIZZA20',
      rules: 'Válido apenas para pizzas grandes. Não cumulativo com outras promoções.',
      value: 20,
      quantity: 100,
      isPaid: false,
      establishmentId: '1',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Frete Grátis',
      description: 'Frete gratuito em compras acima de R$ 50',
      code: 'FRETEGRATIS',
      rules: 'Válido para todo o território nacional. Compra mínima de R$ 50.',
      value: 0,
      quantity: 500,
      isPaid: true,
      establishmentId: '2',
      createdAt: new Date()
    }
  ]);

  const establishments: Establishment[] = [
    { id: '1', name: 'Restaurante Sabor & Arte', category: 'Restaurante', createdAt: new Date() },
    { id: '2', name: 'Farmácia Saúde Total', category: 'Farmácia', createdAt: new Date() },
    { id: '3', name: 'Loja Fashion Style', category: 'Moda', createdAt: new Date() }
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    rules: '',
    value: 0,
    quantity: 1,
    isPaid: false,
    establishmentId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.code || !formData.establishmentId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingVoucher) {
      setVouchers(vouchers.map(voucher => 
        voucher.id === editingVoucher.id 
          ? { ...voucher, ...formData }
          : voucher
      ));
      toast({
        title: "Sucesso",
        description: "Voucher atualizado com sucesso!",
      });
    } else {
      const newVoucher: Voucher = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };
      setVouchers([...vouchers, newVoucher]);
      toast({
        title: "Sucesso",
        description: "Voucher cadastrado com sucesso!",
      });
    }

    setIsDialogOpen(false);
    setEditingVoucher(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      rules: '',
      value: 0,
      quantity: 1,
      isPaid: false,
      establishmentId: ''
    });
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      title: voucher.title,
      description: voucher.description,
      code: voucher.code,
      rules: voucher.rules,
      value: voucher.value,
      quantity: voucher.quantity,
      isPaid: voucher.isPaid,
      establishmentId: voucher.establishmentId
    });
    setIsDialogOpen(true);
  };

  const getEstablishmentName = (establishmentId: string) => {
    const establishment = establishments.find(est => est.id === establishmentId);
    return establishment?.name || 'Estabelecimento não encontrado';
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEstablishmentName(voucher.establishmentId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
          <p className="text-gray-600 mt-2">Gerencie os vouchers cadastrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              setEditingVoucher(null);
              setFormData({
                title: '',
                description: '',
                code: '',
                rules: '',
                value: 0,
                quantity: 1,
                isPaid: false,
                establishmentId: ''
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVoucher ? 'Editar' : 'Novo'} Voucher
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do voucher
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título do voucher"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="CODIGO123"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="establishment">Estabelecimento *</Label>
                <Select value={formData.establishmentId} onValueChange={(value) => setFormData({ ...formData, establishmentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estabelecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {establishments.map((establishment) => (
                      <SelectItem key={establishment.id} value={establishment.id}>
                        {establishment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do voucher"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Regras</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Regras e condições de uso"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor (%)</Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                />
                <Label htmlFor="isPaid">Voucher pago</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVoucher ? 'Atualizar' : 'Cadastrar'}
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
              placeholder="Buscar vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVouchers.map((voucher) => (
              <Card key={voucher.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{voucher.title}</CardTitle>
                        <Badge variant={voucher.isPaid ? "default" : "secondary"}>
                          {voucher.isPaid ? (
                            <><DollarSign className="h-3 w-3 mr-1" />Pago</>
                          ) : (
                            <><Gift className="h-3 w-3 mr-1" />Gratuito</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{getEstablishmentName(voucher.establishmentId)}</p>
                      <Badge variant="outline" className="text-xs font-mono">
                        {voucher.code}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(voucher)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {voucher.description && (
                    <p className="text-sm text-gray-600 mb-3">{voucher.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Valor:</span>
                      <p className="text-gray-900">{voucher.value}%</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Quantidade:</span>
                      <p className="text-gray-900">{voucher.quantity}</p>
                    </div>
                  </div>

                  {voucher.rules && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <span className="text-xs font-medium text-gray-500">Regras:</span>
                      <p className="text-xs text-gray-600 mt-1">{voucher.rules}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredVouchers.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum voucher encontrado' : 'Nenhum voucher cadastrado'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece cadastrando seu primeiro voucher'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VouchersPage;
