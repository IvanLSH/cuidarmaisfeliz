import React, { useState, useEffect } from 'react';
import {
  getMedications,
  createMedication,
  toggleMedicationTaken,
  deleteMedication,
  getLoggedInCaregiver,
  getLinkedCaregiver,
  getLoggedInIdoso,
  getIdosoName,
  getIdososByCaregiver,
} from '../api';

const DEFAULT_MEDS = [
  {
    id: 1,
    name: 'Losartana Potássica',
    dosage: '50 mg',
    time: '08:00',
    instructions: 'Tomar com água após o café da manhã',
    taken: true,
    idoso_name: 'Dona Maria da Silva',
  },
  {
    id: 2,
    name: 'Vitamina D3',
    dosage: '2.000 UI',
    time: '12:00',
    instructions: 'Junto com o almoço',
    taken: false,
    idoso_name: 'Dona Maria da Silva',
  },
  {
    id: 3,
    name: 'Sinvastatina',
    dosage: '20 mg',
    time: '20:00',
    instructions: 'Antes de dormir',
    taken: false,
    idoso_name: 'Dona Maria da Silva',
  },
];

export default function MedicationsPage({ userRole }) {
  const [medications, setMedications] = useState(DEFAULT_MEDS);
  const [idososList, setIdososList] = useState([]);
  const [selectedIdosoCode, setSelectedIdosoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form fields
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [assignedIdosoCode, setAssignedIdosoCode] = useState('');
  const [isApiConnected, setIsApiConnected] = useState(false);

  const isIdoso = userRole === 'idoso';
  const caregiverInfo = getLoggedInCaregiver();
  const linkedCaregiver = getLinkedCaregiver();
  const loggedInIdoso = getLoggedInIdoso();
  const idosoName = getIdosoName();
  const activeCaregiverCode = isIdoso ? linkedCaregiver?.code : caregiverInfo?.code;
  const activeIdosoCode = isIdoso ? loggedInIdoso?.code : null;

  // Fetch medications & idosos list on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMedications(activeCaregiverCode, activeIdosoCode);
        if (data) {
          setMedications(data);
          setIsApiConnected(true);
        }
      } catch (err) {
        console.warn('API não conectada, usando estado local:', err.message);
      } finally {
        setLoading(false);
      }

      if (!isIdoso) {
        try {
          const list = await getIdososByCaregiver(activeCaregiverCode);
          setIdososList(list);
          if (list.length > 0) {
            setAssignedIdosoCode(list[0].code);
          }
        } catch (err) {
          console.warn('Erro ao buscar lista de idosos:', err);
        }
      }
    }
    loadData();
  }, [activeCaregiverCode, activeIdosoCode, isIdoso]);

  const handleToggleTaken = async (id) => {
    const med = medications.find(m => m.id === id);
    if (isApiConnected && med) {
      try {
        const updated = await toggleMedicationTaken(id, med.taken);
        setMedications(medications.map(m => m.id === id ? updated : m));
        return;
      } catch (err) {
        console.error('Erro ao alternar medicamento na API:', err);
      }
    }
    // Fallback local
    setMedications(medications.map(m => 
      m.id === id ? { ...m, taken: !m.taken } : m
    ));
  };

  const handleDelete = async (id) => {
    if (isApiConnected) {
      try {
        await deleteMedication(id);
        setMedications(medications.filter(m => m.id !== id));
        return;
      } catch (err) {
        console.error('Erro ao deletar medicamento na API:', err);
      }
    }
    // Fallback local
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!newName || !newTime) return;

    const selectedIdoso = idososList.find(i => i.code === assignedIdosoCode);

    const payload = {
      name: newName,
      dosage: newDosage || 'Dosagem padrão',
      time: newTime,
      instructions: newInstructions || 'Sem instruções adicionais',
      caregiver_code: activeCaregiverCode || 'CF#7X9K',
      idoso_code: assignedIdosoCode || null,
      idoso_name: selectedIdoso ? selectedIdoso.name : 'Idoso',
    };

    if (isApiConnected) {
      try {
        const created = await createMedication(payload);
        setMedications([...medications, created]);
        resetForm();
        return;
      } catch (err) {
        console.error('Erro ao criar medicamento na API:', err);
      }
    }

    // Fallback local
    const newMed = {
      id: Date.now(),
      ...payload,
      taken: false,
    };
    setMedications([...medications, newMed]);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewDosage('');
    setNewTime('');
    setNewInstructions('');
    setShowAddForm(false);
  };

  const takenCount = medications.filter(m => m.taken).length;

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Idoso Linkage Notice Banner */}
        {isIdoso && linkedCaregiver && (
          <div className="bg-emerald-800 text-white rounded-2xl p-5 mb-6 shadow-md border-2 border-emerald-950 flex items-center justify-between font-black text-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 flex items-center justify-center shrink-0 border border-emerald-700">
                <svg className="w-7 h-7 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <p className="text-base text-emerald-200 uppercase font-extrabold tracking-wider">
                  {idosoName ? `Olá, ${idosoName}!` : 'Perfil Vinculado'}
                </p>
                <p className="text-xl">Cuidador Responsável: <strong className="text-white underline">{linkedCaregiver.name}</strong></p>
              </div>
            </div>
            {loggedInIdoso && (
              <span className="bg-emerald-950 px-3.5 py-2 rounded-xl border border-emerald-600 text-sm font-black">
                Seu Código: {loggedInIdoso.code}
              </span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 bg-blue-800 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border-2 border-blue-950">
            Controle Diário
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-3">
            Gerenciamento de Medicamentos
          </h1>
          <p className="mt-3 text-lg text-slate-800 font-bold">
            Acompanhe seus remédios diários, horários e marque o que já foi tomado.
          </p>
        </div>

        {/* Progress Alert Banner - Solid Blue */}
        <div className="bg-blue-800 text-white rounded-2xl p-6 mb-8 shadow-md border-2 border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">Progresso de Hoje</h3>
            <p className="text-white text-base font-bold mt-1">
              Você tomou <strong className="text-amber-300 text-lg font-black">{takenCount}</strong> de <strong className="text-white text-lg font-black">{medications.length}</strong> medicamentos agendados.
            </p>
          </div>
          {!isIdoso && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-xl shadow-md text-base transition cursor-pointer border-2 border-slate-950"
            >
              {showAddForm ? 'Cancelar' : '+ Adicionar Remédio'}
            </button>
          )}
        </div>

        {/* Add Medication Form (Caregiver only) */}
        {!isIdoso && showAddForm && (
          <form onSubmit={handleAddMedication} className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-xl mb-8 space-y-4">
            <h3 className="text-xl font-black text-slate-950">Cadastrar Novo Medicamento</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-1">Para qual idoso? *</label>
                <select
                  value={assignedIdosoCode}
                  onChange={(e) => setAssignedIdosoCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
                >
                  {idososList.length === 0 ? (
                    <option value="">Nenhum idoso cadastrado ainda (Será genérico)</option>
                  ) : (
                    idososList.map((i) => (
                      <option key={i.code} value={i.code}>
                        {i.name} ({i.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-1">Nome do Medicamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Losartana"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-1">Dosagem</label>
                <input
                  type="text"
                  placeholder="Ex: 50 mg ou 1 comprimido"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-1">Horário *</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-extrabold text-slate-900 mb-1">Instruções / Observações</label>
                <input
                  type="text"
                  placeholder="Ex: Tomar após o almoço"
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base rounded-xl shadow transition cursor-pointer border border-blue-950"
              >
                Salvar Medicamento
              </button>
            </div>
          </form>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="bg-white p-8 rounded-2xl text-center border-2 border-slate-300 text-slate-800 font-bold text-lg">
            Carregando medicamentos...
          </div>
        ) : (
          /* Medications List */
          <div className="space-y-4">
            {medications.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border-2 border-slate-300 text-slate-800 font-bold text-lg">
                Nenhum medicamento cadastrado ainda para este idoso.
              </div>
            ) : (
              medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                    med.taken
                      ? 'border-blue-600 bg-blue-100 text-slate-950'
                      : 'border-slate-300 bg-white hover:border-blue-600 text-slate-950'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Status Indicator - Solid Block */}
                    <div
                      className={`px-4 py-2.5 rounded-xl flex flex-col items-center justify-center shrink-0 border-2 ${
                        med.taken
                          ? 'bg-blue-800 text-white border-blue-950'
                          : 'bg-amber-100 text-amber-950 border-amber-400'
                      }`}
                    >
                      <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-black">{med.time}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-xl font-black ${med.taken ? 'line-through text-slate-600' : 'text-slate-950'}`}>
                          {med.name}
                        </h3>
                        <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-200 text-slate-900 border border-slate-300">
                          {med.dosage}
                        </span>
                        {!isIdoso && med.idoso_name && (
                          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-blue-100 text-blue-950 border border-blue-300">
                            Idoso: {med.idoso_name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 mt-1">{med.instructions}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t-2 sm:border-0 border-slate-200">
                    <button
                      onClick={() => handleToggleTaken(med.id)}
                      className={`px-5 py-2.5 text-sm font-black rounded-xl transition cursor-pointer border ${
                        med.taken
                          ? 'bg-blue-800 text-white border-blue-950 hover:bg-blue-900'
                          : 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-600'
                      }`}
                    >
                      {med.taken ? 'Tomado' : 'Marcar como Tomado'}
                    </button>

                    {!isIdoso && (
                      <button
                        onClick={() => handleDelete(med.id)}
                        className="p-2.5 text-slate-700 hover:text-red-700 hover:bg-red-100 rounded-xl transition cursor-pointer border border-slate-300"
                        title="Remover"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
