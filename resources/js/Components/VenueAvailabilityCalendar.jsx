import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VenueAvailabilityCalendar({ 
    unavailableDates = [], 
    onDateSelect 
}) {
    const disabledDates = unavailableDates.map(dateStr => parseISO(dateStr));
    const today = startOfDay(new Date());

    const matcherDisabled = [
        { before: today },
        ...disabledDates
    ];

    const modifiers = {
        booked: disabledDates
    };
    const modifiersClassNames = {
        booked: 'rdp-day_booked'
    };

    const [selectedRange, setSelectedRange] = useState();

    const handleSelect = (range) => {
        setSelectedRange(range);
        if (onDateSelect) {
            onDateSelect(range);
        }
    };

    const customStyles = `
        .celebra-calendar {
            font-family: 'Inter', sans-serif;
            background-color: #FAF6F0;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            margin: 0 auto;
        }
        
        .celebra-calendar .rdp-caption_label {
            font-family: 'Fraunces', serif;
            color: #0B3D2E;
            font-size: 1.25rem;
            font-weight: 700;
            text-transform: capitalize;
        }

        .celebra-calendar .rdp-nav_button {
            color: #0B3D2E;
        }
        .celebra-calendar .rdp-nav_button:hover {
            background-color: rgba(11, 61, 46, 0.1);
        }
        
        .celebra-calendar .rdp-head_cell {
            color: #0B3D2E;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
        }
        
        .celebra-calendar .rdp-day {
            color: #1f2937;
            font-weight: 500;
            border-radius: 6px;
        }
        
        .celebra-calendar .rdp-day:hover:not(.rdp-day_disabled) {
            background-color: #C9A227;
            color: white;
        }
        
        .celebra-calendar .rdp-day_selected, 
        .celebra-calendar .rdp-day_selected:focus-visible, 
        .celebra-calendar .rdp-day_selected:hover {
            background-color: #0B3D2E !important;
            color: white;
            font-weight: 700;
        }
        
        .celebra-calendar .rdp-day_disabled {
            opacity: 0.4;
            text-decoration: none;
        }
        
        .celebra-calendar .rdp-day_booked, 
        .celebra-calendar .rdp-day_booked:hover {
            background-color: #fee2e2;
            color: #dc2626;
            text-decoration: line-through;
            font-weight: 700;
            opacity: 0.9;
        }
    `;

    return (
        <div className="w-full flex flex-col items-center">
            <style>{customStyles}</style>
            
            <DayPicker 
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                locale={fr}
                disabled={matcherDisabled}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="celebra-calendar"
                showOutsideDays
            />
            
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm font-medium font-inter">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FAF6F0', border: '1px solid #d1d5db' }}></div>
                    <span className="text-gray-700">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0B3D2E' }}></div>
                    <span className="text-gray-700">Sélectionné</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fee2e2' }}>
                        <div className="w-full h-0.5 bg-red-600 absolute rotate-45 transform"></div>
                    </div>
                    <span className="text-red-600">Réservé / Indisponible</span>
                </div>
            </div>
        </div>
    );
}
