import React, { useEffect, useState } from "react";
import { fetchSchedulingSettings, updateSchedulingSettings, fetchWeeklyAvailability, setWeeklyAvailability } from "@/services/scheduling-service";
import { SchedulingSettings, WeeklyAvailabilityRule } from "@/types/scheduling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Componente de configuração de duração dos horários
function DuracaoHorariosForm({ settings, onSave }: { settings: SchedulingSettings, onSave: (val: number) => void }) {
  const [value, setValue] = useState(settings.slot_duration_minutes);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(value);
      }}
    >
      <label className="font-medium">Duração dos horários:</label>
      <Input
        type="number"
        min={10}
        max={240}
        step={5}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-20"
      />
      <span>minutos</span>
      <Button type="submit" size="sm">Salvar</Button>
    </form>
  );
}

// Componente de configuração de janela de programação
function JanelaProgramacaoForm({ settings, onSave }: { settings: SchedulingSettings, onSave: (min: number, max: number) => void }) {
  const [minHours, setMinHours] = useState(settings.min_advance_booking_hours);
  const [maxDays, setMaxDays] = useState(settings.max_advance_booking_days);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(minHours, maxDays);
      }}
    >
      <label className="font-medium">Antecedência:</label>
      <Input
        type="number"
        min={0}
        max={48}
        value={minHours}
        onChange={e => setMinHours(Number(e.target.value))}
        className="w-16"
      />
      <span>horas mín.</span>
      <Input
        type="number"
        min={1}
        max={365}
        value={maxDays}
        onChange={e => setMaxDays(Number(e.target.value))}
        className="w-16"
      />
      <span>dias máx.</span>
      <Button type="submit" size="sm">Salvar</Button>
    </form>
  );
}

// Componente de configuração de disponibilidade semanal
function DisponibilidadeSemanalForm({
  rules,
  onSave
}: {
  rules: WeeklyAvailabilityRule[],
  onSave: (rules: WeeklyAvailabilityRule[]) => void
}) {
  // Para simplificação, apenas exibe e permite editar/remover intervalos existentes
  const [localRules, setLocalRules] = useState<WeeklyAvailabilityRule[]>(rules);

  const handleChange = (idx: number, field: "start_time" | "end_time", value: string) => {
    setLocalRules(rules =>
      rules.map((r, i) => i === idx ? { ...r, [field]: value } : r)
    );
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(localRules);
      }}
    >
      <label className="font-medium mb-1">Disponibilidade semanal:</label>
      {localRules.map((rule, idx) => (
        <div key={rule.id} className="flex items-center gap-2">
          <span className="w-20">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][rule.day_of_week]}</span>
          <Input
            type="time"
            value={rule.start_time.slice(0,5)}
            onChange={e => handleChange(idx, "start_time", e.target.value + ":00")}
            className="w-24"
          />
          <span>até</span>
          <Input
            type="time"
            value={rule.end_time.slice(0,5)}
            onChange={e => handleChange(idx, "end_time", e.target.value + ":00")}
            className="w-24"
          />
        </div>
      ))}
      <Button type="submit" size="sm" className="mt-2">Salvar</Button>
    </form>
  );
}

export default function AgendamentoConfiguracoes() {
  const [settings, setSettings] = useState<SchedulingSettings | null>(null);
  const [rules, setRules] = useState<WeeklyAvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const s = await fetchSchedulingSettings();
      const r = await fetchWeeklyAvailability();
      setSettings(s);
      setRules(r);
      setLoading(false);
    })();
  }, []);

  const handleSaveDuracao = async (val: number) => {
    await updateSchedulingSettings({ slot_duration_minutes: val });
    toast.success("Duração dos horários atualizada!");
    setSettings(s => s ? { ...s, slot_duration_minutes: val } : s);
  };

  const handleSaveJanela = async (min: number, max: number) => {
    await updateSchedulingSettings({ min_advance_booking_hours: min, max_advance_booking_days: max });
    toast.success("Janela de programação atualizada!");
    setSettings(s => s ? { ...s, min_advance_booking_hours: min, max_advance_booking_days: max } : s);
  };

  const handleSaveDisponibilidade = async (newRules: WeeklyAvailabilityRule[]) => {
    // Remove os campos id, created_at, updated_at para inserção
    await setWeeklyAvailability(newRules.map(r => ({
      day_of_week: r.day_of_week,
      start_time: r.start_time,
      end_time: r.end_time,
      is_available: r.is_available
    })));
    toast.success("Disponibilidade semanal atualizada!");
    // Recarregar regras
    const r = await fetchWeeklyAvailability();
    setRules(r);
  };

  if (loading || !settings) return <div className="p-4">Carregando configurações...</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <DuracaoHorariosForm settings={settings} onSave={handleSaveDuracao} />
      <JanelaProgramacaoForm settings={settings} onSave={handleSaveJanela} />
      <DisponibilidadeSemanalForm rules={rules} onSave={handleSaveDisponibilidade} />
    </div>
  );
}
