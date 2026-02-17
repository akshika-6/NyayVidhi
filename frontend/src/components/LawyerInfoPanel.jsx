import React from 'react';
import { Briefcase, MapPin, Star, User, CheckCircle } from 'lucide-react';
import SlotSelector from './SlotSelector';

const LawyerInfoPanel = ({ lawyer, onSlotSelect, bookedSlot, isBooking }) => {
  if (!lawyer) return null;

  return (
    <div className="w-full md:w-2/5 bg-slate-900/50 border-l border-slate-700/50 p-4 md:p-6 flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center gap-4">
          <img
            src={lawyer.profile_image}
            alt={lawyer.full_name}
            className="w-16 h-16 rounded-full border-2 border-indigo-500"
          />
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {lawyer.full_name}
              {lawyer.is_verified && <CheckCircle size={16} className="text-green-400" />}
            </h2>
            <div className={`text-xs font-semibold flex items-center gap-1.5 ${
              lawyer.is_online ? 'text-green-400' : 'text-slate-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${lawyer.is_online ? 'bg-green-500' : 'bg-slate-500'}`}></span>
              {lawyer.is_online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-3 text-slate-300">
            <Briefcase size={16} className="text-indigo-400" />
            <span className="font-medium">{lawyer.specialization.join(', ')}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <User size={16} className="text-indigo-400" />
            <span className="font-medium">{lawyer.experience_years} years of experience</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <MapPin size={16} className="text-indigo-400" />
            <span className="font-medium">{lawyer.city}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Star size={16} className="text-amber-400" />
            <span className="font-medium">{lawyer.rating} / 5.0</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 border-t border-slate-800 pt-4">
          {lawyer.bio}
        </p>

        <div className="mt-4 border-t border-slate-800 pt-4">
            <SlotSelector 
                lawyer={lawyer}
                onSlotSelect={onSlotSelect}
                bookedSlot={bookedSlot}
                isBooking={isBooking}
            />
        </div>
      </div>
      
      <div className="text-center mt-6">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} NyayVidhi - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default LawyerInfoPanel;
