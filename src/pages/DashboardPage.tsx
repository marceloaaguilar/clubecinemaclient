
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Tag, DollarSign, Users } from 'lucide-react';

const DashboardPage = () => {
  // Dados simulados para o dashboard
  const stats = [
    {
      title: 'Total de Estabelecimentos',
      value: '12',
      description: '+2 este mês',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      title: 'Vouchers Ativos',
      value: '48',
      description: '+8 esta semana',
      icon: Tag,
      color: 'bg-green-500'
    },
    {
      title: 'Vouchers Pagos',
      value: '31',
      description: '64% do total',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Vouchers Gratuitos',
      value: '17',
      description: '36% do total',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de vouchers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-full`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estabelecimentos Recentes</CardTitle>
            <CardDescription>Últimos estabelecimentos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Restaurante Sabor & Arte', 'Farmácia Saúde Total', 'Loja Fashion Style'].map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">Cadastrado hoje</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vouchers Populares</CardTitle>
            <CardDescription>Vouchers com maior demanda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Desconto 20% Pizza', establishment: 'Pizzaria Italiana' },
                { name: '2x1 em Hambúrgueres', establishment: 'Burger House' },
                { name: 'Frete Grátis', establishment: 'Loja Online' }
              ].map((voucher, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Tag className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{voucher.name}</p>
                    <p className="text-sm text-gray-500">{voucher.establishment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
