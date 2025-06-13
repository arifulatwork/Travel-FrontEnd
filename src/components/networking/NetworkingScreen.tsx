import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, MapPin, Calendar, Globe, Languages, Briefcase, UserPlus, X, MessageCircle, Mail, Clock, Video, Coffee, Plus, Check, Link, Copy, Tag } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TravelBuddy {
  id: string;
  name: string;
  location: string;
  interests: string[];
  languages: string[];
  travelDates: string;
  avatar?: string;
  occupation?: string;
  bio?: string;
  connectionStatus: 'none' | 'pending' | 'connected';
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'virtual' | 'in-person';
  location?: string;
  description: string;
  attendees: TravelBuddy[];
  organizer: TravelBuddy;
  meetingLink?: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

const NetworkingScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<TravelBuddy | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetingSuccess, setShowMeetingSuccess] = useState(false);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'buddies' | 'meetings'>('buddies');
  const [travelBuddies, setTravelBuddies] = useState<TravelBuddy[]>([]);
  
  const [meetingForm, setMeetingForm] = useState<Partial<Meeting>>({
    title: '',
    date: '',
    time: '',
    duration: '1',
    type: 'virtual',
    location: '',
    description: '',
    attendees: []
  });
  
  const [newParticipant, setNewParticipant] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantError, setParticipantError] = useState('');

  const locations = ['Barcelona', 'Madrid', 'Paris', 'Rome', 'Berlin', 'Amsterdam'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/network/users', {
          params: {
            location: selectedLocation,
            search: searchQuery
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTravelBuddies(response.data.map((user: any) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          location: user.location || '',
          interests: user.interests || [],
          languages: user.languages || [],
          travelDates: user.travel_dates || '',
          avatar: user.avatar_url,
          occupation: user.occupation || '',
          bio: user.bio || '',
          connectionStatus: user.connection_status || 'none'
        })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [selectedLocation, searchQuery]);

  const filteredBuddies = travelBuddies.filter(buddy => {
    const matchesSearch = 
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      buddy.languages.some(language => language.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !selectedLocation || buddy.location === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  const handleConnect = (buddy: TravelBuddy) => {
    setSelectedBuddy(buddy);
    setShowConnectionModal(true);
  };

  const sendConnectionRequest = async () => {
    if (!selectedBuddy) return;

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/network/request', {
        receiver_id: selectedBuddy.id,
        message: connectionMessage
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTravelBuddies(prev =>
        prev.map(b =>
          b.id === selectedBuddy.id ? { ...b, connectionStatus: 'pending' } : b
        )
      );

      setShowConnectionModal(false);
      setConnectionMessage('');
      setSelectedBuddy(null);
    } catch (error: any) {
      console.error('Error sending connection request:', error.response?.data || error);
      alert(error.response?.data?.message || 'Request failed');
    }
  };

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  const sendInvites = () => {
    console.log('Sending invites to:', inviteEmails);
    console.log('Invitation message:', inviteMessage);
    
    setShowInviteSuccess(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setShowInviteSuccess(false);
      setInviteEmails('');
      setInviteMessage('');
    }, 2000);
  };

  const handleCreateMeeting = () => {
    setShowMeetingModal(true);
  };

  const scheduleMeeting = () => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...meetingForm as Meeting,
      attendees: [],
      organizer: travelBuddies[0],
      meetingLink: meetingForm.type === 'virtual' ? 'https://meet.example.com/' + Math.random().toString(36).substring(7) : undefined
    };

    setMeetings([...meetings, newMeeting]);
    setShowMeetingSuccess(true);
    
    setTimeout(() => {
      setShowMeetingModal(false);
      setShowMeetingSuccess(false);
      setMeetingForm({
        title: '',
        date: '',
        time: '',
        duration: '1',
        type: 'virtual',
        location: '',
        description: '',
        attendees: []
      });
      setParticipants([]);
    }, 2000);
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const handleAddParticipant = () => {
    if (!newParticipant) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newParticipant)) {
      setParticipantError('Please enter a valid email address');
      return;
    }

    const newId = Date.now().toString();
    setParticipants([...participants, { 
      id: newId,
      name: newParticipant.split('@')[0],
      email: newParticipant 
    }]);
    setNewParticipant('');
    setParticipantError('');
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showMeetingSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>Meeting scheduled successfully!</span>
          </div>
        </div>
      )}

      {showInviteSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>Invitations sent successfully!</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Messages</h2>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <UserPlus className="h-4 w-4" />
            Invite to Chat
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('buddies')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'buddies'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'meetings'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Meetings
        </button>
      </div>

      {activeTab === 'buddies' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search buddies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mt-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="divide-y">
              {filteredBuddies.map(buddy => (
                <div key={buddy.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {buddy.avatar ? (
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{buddy.name}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {buddy.location}
                      </div>
                    </div>
                    {buddy.connectionStatus === 'none' && (
                      <button
                        onClick={() => handleConnect(buddy)}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                      >
                        <UserPlus className="h-4 w-4" />
                        Connect
                      </button>
                    )}
                    {buddy.connectionStatus === 'pending' && (
                      <span className="text-orange-600 text-sm">Pending</span>
                    )}
                    {buddy.connectionStatus === 'connected' && (
                      <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start messaging</h3>
              <p className="text-gray-600">Choose someone from the list to start a conversation</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Upcoming Meetings</h3>
            <button
              onClick={handleCreateMeeting}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </button>
          </div>

          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{meeting.title}</h3>
                      <p className="text-gray-600">{meeting.description}</p>
                    </div>
                    {meeting.type === 'virtual' && meeting.meetingLink && (
                      <button
                        onClick={() => copyMeetingLink(meeting.meetingLink!)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                      >
                        <Link className="h-4 w-4" />
                        Copy Link
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.duration} hour(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {meeting.type === 'virtual' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span>{meeting.type === 'virtual' ? 'Virtual Meeting' : meeting.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {participants.slice(0, 3).map((participant) => (
                        <div
                          key={participant.id}
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white"
                        >
                          <span className="text-purple-600 text-xs font-medium">
                            {participant.name[0].toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                    {participants.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{participants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Meetings Scheduled</h3>
              <p className="text-gray-600 mb-4">Schedule a meeting to connect with travel buddies</p>
              <button
                onClick={handleCreateMeeting}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                Schedule Meeting
              </button>
            </div>
          )}
        </div>
      )}

      {/* Connection Modal */}
      {showConnectionModal && selectedBuddy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Connect with {selectedBuddy.name}</h3>
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setConnectionMessage('');
                  setSelectedBuddy(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a message (optional)
              </label>
              <textarea
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Hi! I noticed we'll be in Barcelona at the same time..."
              />
            </div>

            <button
              onClick={sendConnectionRequest}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              Send Connection Request
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invite Travel Buddies</h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmails('');
                  setInviteMessage('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Addresses
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="Enter email addresses (one per line)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button
                onClick={sendInvites}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                Send Invitations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Schedule Meeting</h3>
              <button
                onClick={() => {
                  setShowMeetingModal(false);
                  setMeetingForm({
                    title: '',
                    date: '',
                    time: '',
                    duration: '1',
                    type: 'virtual',
                    location: '',
                    description: '',
                    attendees: []
                  });
                  setParticipants([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              scheduleMeeting();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter meeting title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  value={meetingForm.duration}
                  onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {[0.5, 1, 1.5, 2, 2.5, 3].map((duration) => (
                    <option key={duration} value={duration}>{duration} hour{duration > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="virtual"
                      checked={meetingForm.type === 'virtual'}
                      onChange={(e) => setMeetingForm({ ...meetingForm, type: 'virtual' as const })}
                      className="mr-2"
                    />
                    <Video className="h-4 w-4 mr-1" />
                    Virtual
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="in-person"
                      checked={meetingForm.type === 'in-person'}
                      onChange={(e) => setMeetingForm({ ...meetingForm, type: 'in-person' as const })}
                      className="mr-2"
                    />
                    <Coffee className="h-4 w-4 mr-1" />
                    In-person
                  </label>
                </div>
              </div>

              {meetingForm.type === 'in-person' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter meeting location"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter meeting description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Participants
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  {participantError && (
                    <p className="text-sm text-red-600">{participantError}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm text-purple-700">{participant.email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="text-purple-700 hover:text-purple-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                Schedule Meeting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkingScreen;