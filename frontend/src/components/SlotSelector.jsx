import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const SlotSelector = ({ lawyer, onSlotSelect, bookedSlot, isBooking }) => {
  const today = new Date().toISOString().split('T')[0];

  const availableToday = lawyer.available_slots?.find(s => s.date === today);

  const handleSelect = (slot) => {
    if (bookedSlot || isBooking) return;
    onSlotSelect({
      lawyer_id: lawyer.id,
      date: today,
      slot: slot,
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
        <Calendar size={14} />
        Free Consultation Slots
      </h3>
      {lawyer.is_online ? (
        <>
          {availableToday && availableToday.slots.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Available Today ({today}):</p>
              <div className="flex flex-wrap gap-2">
                {availableToday.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleSelect(slot)}
                    disabled={isBooking || !!bookedSlot}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      bookedSlot?.slot === slot
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : isBooking
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    <Clock size={12} className="inline mr-1.5" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No slots available today.</p>
          )}
        </>
      ) : (
        <p className="text-xs text-amber-400 bg-amber-900/30 p-2 rounded-md">
          Lawyer is currently offline. You may leave a message.
        </p>
      )}
       {bookedSlot && (
        <div className="mt-3 text-center text-xs font-medium text-green-300 bg-green-900/50 p-2 rounded-md">
          {`Your consultation is booked for ${bookedSlot.slot} on ${bookedSlot.date}.`}
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
