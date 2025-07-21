import React, { useState } from 'react';
import { Ticket, CreditCard, Plus, TrendingUp, History, X, Info, Gift, Award, Sparkles, Send, Search, Users, Calendar, Star } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import HistorySection from './HistorySection';

const TRANSLATIONS = {
  en: {
    balance: 'Balance',
    addFunds: 'Add Funds',
    rewardPoints: 'Reward Points',
    earnPoints: 'Earn {points} points for every',
    giftTravel: 'Gift Travel',
    availableRewards: 'Available Rewards',
    history: 'Transaction History',
    amount: 'Amount',
    confirm: 'Confirm',
    selectUser: 'Please select a user',
    enterAmount: 'Please enter an amount',
    insufficientFunds: 'Insufficient funds',
    transactionSuccess: 'Transaction completed successfully',
    selectRecipient: 'Select Recipient',
    searchRecipient: 'Search by name or email',
    message: 'Message (optional)',
    send: 'Send Gift'
  },
  es: {
    balance: 'Saldo',
    addFunds: 'Añadir Fondos',
    rewardPoints: 'Puntos de Recompensa',
    earnPoints: 'Gana {points} puntos por cada',
    giftTravel: 'Regalar Viaje',
    availableRewards: 'Recompensas Disponibles',
    history: 'Historial de Transacciones',
    amount: 'Cantidad',
    confirm: 'Confirmar',
    selectUser: 'Por favor selecciona un usuario',
    enterAmount: 'Por favor ingresa una cantidad',
    insufficientFunds: 'Fondos insuficientes',
    transactionSuccess: 'Transacción completada con éxito',
    selectRecipient: 'Seleccionar Destinatario',
    searchRecipient: 'Buscar por nombre o email',
    message: 'Mensaje (opcional)',
    send: 'Enviar Regalo'
  },
  fr: {
    balance: 'Solde',
    addFunds: 'Ajouter des Fonds',
    rewardPoints: 'Points de Récompense',
    earnPoints: 'Gagnez {points} points pour chaque',
    giftTravel: 'Offrir un Voyage',
    availableRewards: 'Récompenses Disponibles',
    history: 'Historique des Transactions',
    amount: 'Montant',
    confirm: 'Confirmer',
    selectUser: 'Veuillez sélectionner un utilisateur',
    enterAmount: 'Veuillez entrer un montant',
    insufficientFunds: 'Fonds insuffisants',
    transactionSuccess: 'Transaction effectuée avec succès',
    selectRecipient: 'Sélectionner un Destinataire',
    searchRecipient: 'Rechercher par nom ou email',
    message: 'Message (optionnel)',
    send: 'Envoyer le Cadeau'
  },
  de: {
    balance: 'Kontostand',
    addFunds: 'Geld Hinzufügen',
    rewardPoints: 'Bonuspunkte',
    earnPoints: 'Verdienen Sie {points} Punkte für jeden',
    giftTravel: 'Reise Verschenken',
    availableRewards: 'Verfügbare Belohnungen',
    history: 'Transaktionsverlauf',
    amount: 'Betrag',
    confirm: 'Bestätigen',
    selectUser: 'Bitte wählen Sie einen Benutzer aus',
    enterAmount: 'Bitte geben Sie einen Betrag ein',
    insufficientFunds: 'Unzureichendes Guthaben',
    transactionSuccess: 'Transaktion erfolgreich abgeschlossen',
    selectRecipient: 'Empfänger Auswählen',
    searchRecipient: 'Nach Name oder E-Mail suchen',
    message: 'Nachricht (optional)',
    send: 'Geschenk Senden'
  }
};

const TokensScreen: React.FC = () => {
  const { settings } = useSettings();
  const [balance, setBalance] = useState(200);
  const [points, setPoints] = useState(1250);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);

  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  // Mock users data
  const users: User[] = [
    { id: '1', name: 'Emma Wilson', email: 'emma.w@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: '2', name: 'Michael Chen', email: 'michael.c@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: '3', name: 'Sofia Garcia', email: 'sofia.g@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' }
  ];

  // Mock rewards data
  const rewards: Reward[] = [
    {
      id: '1',
      name: '10% Off Next Tour',
      description: 'Get 10% off on your next tour booking',
      pointsCost: 500,
      type: 'discount',
      icon: 'Ticket',
      expiresIn: '30 days'
    },
    {
      id: '2',
      name: 'VIP Experience',
      description: 'Upgrade to VIP status on your next tour',
      pointsCost: 1000,
      type: 'upgrade',
      icon: 'Star'
    },
    {
      id: '3',
      name: 'Free City Tour',
      description: 'Enjoy a complimentary city walking tour',
      pointsCost: 1500,
      type: 'experience',
      icon: 'Gift'
    }
  ];

  // Mock transactions data
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 100,
      date: '2024-02-20',
      description: 'Added funds',
      category: 'Deposit'
    },
    {
      id: 2,
      type: 'spent',
      amount: 45,
      date: '2024-02-19',
      description: 'Sagrada Familia Tour',
      category: 'Tour',
      location: 'Barcelona'
    },
    {
      id: 3,
      type: 'spent',
      amount: 25,
      date: '2024-02-18',
      description: 'Gothic Quarter Walk',
      category: 'Tour',
      location: 'Barcelona'
    }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setPoints(prev => prev + Math.floor(amount * 5)); // 5 points per currency unit
      setShowAddFundsModal(false);
      setAddAmount('');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  const handleGiftSend = () => {
    if (!selectedUser) {
      setError(t.selectUser);
      return;
    }

    const amount = parseFloat(giftAmount);
    if (!amount || amount <= 0) {
      setError(t.enterAmount);
      return;
    }

    if (amount > balance) {
      setError(t.insufficientFunds);
      return;
    }

    setBalance(prev => prev - amount);
    setShowGiftModal(false);
    setGiftAmount('');
    setGiftMessage('');
    setSelectedUser(null);
    setSearchQuery('');
    setError(null);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleRewardClaim = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && points >= reward.pointsCost) {
      setPoints(prev => prev - reward.pointsCost);
      setActiveRewardId(rewardId);
      setTimeout(() => setActiveRewardId(null), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6 py-4">
      {showConfirmation && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {t.transactionSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t.balance}</h2>
            <CreditCard className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold mb-4">{balance} EUR</p>
          <button 
            onClick={() => setShowAddFundsModal(true)}
            className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.addFunds}
          </button>
        </div>

        {/* Points Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t.rewardPoints}</h2>
            <Award className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold mb-4">{points} pts</p>
          <p className="text-sm opacity-90">
            {t.earnPoints.replace('{points}', '5')} EUR
          </p>
        </div>

        {/* Gift Travel Card */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t.giftTravel}</h2>
            <Gift className="h-6 w-6" />
          </div>
          <p className="text-lg mb-4">Share the joy of travel with your friends and family</p>
          <button 
            onClick={() => setShowGiftModal(true)}
            className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            {t.giftTravel}
          </button>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t.availableRewards}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {reward.icon === 'Ticket' && <Ticket className="h-5 w-5 text-purple-600 mr-2" />}
                  {reward.icon === 'Star' && <Star className="h-5 w-5 text-purple-600 mr-2" />}
                  {reward.icon === 'Gift' && <Gift className="h-5 w-5 text-purple-600 mr-2" />}
                  <h4 className="font-semibold">{reward.name}</h4>
                </div>
                {reward.expiresIn && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {reward.expiresIn}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-600">{reward.pointsCost} pts</span>
                <button
                  onClick={() => handleRewardClaim(reward.id)}
                  disabled={points < reward.pointsCost || activeRewardId === reward.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    points >= reward.pointsCost
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {activeRewardId === reward.id ? 'Claimed!' : 'Claim Reward'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">{t.history}</h3>
        <HistorySection transactions={transactions} />
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t.addFunds}</h3>
              <button 
                onClick={() => setShowAddFundsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.amount}
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={t.amount}
              />
              <p className="text-sm text-gray-600 mt-2">
                {t.earnPoints.replace('{points}', addAmount ? Math.floor(parseFloat(addAmount) * 5).toString() : '0')}
              </p>
            </div>
            <button
              onClick={handleAddFunds}
              disabled={!addAmount || parseFloat(addAmount) <= 0}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t.giftTravel}</h3>
              <button 
                onClick={() => {
                  setShowGiftModal(false);
                  setError(null);
                  setGiftAmount('');
                  setGiftMessage('');
                  setSelectedUser(null);
                  setSearchQuery('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.selectRecipient}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchRecipient}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {searchQuery && (
                  <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery('');
                        }}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedUser && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-8 h-8 rounded-full mr-3" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.amount}
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t.amount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message}
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t.message}
                />
              </div>

              <button
                onClick={handleGiftSend}
                disabled={!selectedUser || !giftAmount || parseFloat(giftAmount) <= 0}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensScreen;