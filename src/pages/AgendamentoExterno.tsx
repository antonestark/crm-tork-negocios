import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AgendamentoExterno: React.FC = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !telefone || !email || !data || !horaInicio || !horaFim || !descricao) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const dataHoraInicio = `${data}T${horaInicio}:00`;
    const dataHoraFim = `${data}T${horaFim}:00`;

    // Verificar conflito
    const { data: conflitos, error: erroConflito } = await supabase
      .from('scheduling')
      .select('*')
      .or(`and(data.eq.${data},hora_inicio.lt.${dataHoraFim},hora_fim.gt.${dataHoraInicio})`);

    if (erroConflito) {
      toast.error('Erro ao verificar disponibilidade.');
      return;
    }

    if (conflitos && conflitos.length > 0) {
      toast.error('Já existe um agendamento para este horário.');
      return;
    }

    // Salvar agendamento
    const { error } = await supabase.from('scheduling').insert([
      {
        title: nome,
        phone: telefone,
        email: email,
        start_time: `${data}T${horaInicio}:00`,
        end_time: `${data}T${horaFim}:00`,
        description: descricao,
        status: 'pending'
      },
    ]);

    if (error) {
      toast.error('Erro ao registrar agendamento.');
    } else {
      toast.success('Agendamento registrado com sucesso!');
      setNome('');
      setTelefone('');
      setEmail('');
      setData('');
      setHoraInicio('');
      setHoraFim('');
      setDescricao('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agendamento Externo</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
        <div className="flex gap-2">
          <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
          <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
        </div>
        <Input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <Button type="submit">Agendar</Button>
      </form>
    </div>
  );
};

export default AgendamentoExterno;
