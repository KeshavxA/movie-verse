import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, X, Film, Tv } from "lucide-react";
import Navbar from "../components/Navbar";

const TMDB_API_KEY = "4fdd0d59a1f17e38b912e065674f80d8";

export default function ReleaseCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [mediaType, setMediaType] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      
      const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${lastDay}`;

      let url = "";
      if (mediaType === "movie") {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=primary_release_date.asc`;
      } else {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&sort_by=first_air_date.asc`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setEvents(data.results || []);
      } catch (err) {
        console.error("Failed to fetch calendar events", err);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [currentDate, mediaType]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const exportToICS = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dateStr = item.release_date || item.first_air_date;
    if (!dateStr) return;
    
    const dateParts = dateStr.split('-');
    const icsDate = `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;
    const title = item.title || item.name;
    const description = item.overview || "No overview available.";
    
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MovieVerse//Calendar//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:${icsDate}
DTEND;VALUE=DATE:${icsDate}
SUMMARY:${title} Release
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_release.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => (e.release_date || e.first_air_date) === dateString);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar searchTerm={""} setSearchTerm={() => {}} />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent flex items-center gap-3">
              <CalendarIcon className="text-blue-600 dark:text-blue-500" size={40} />
              Release Calendar
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Never miss a premiere. Export dates to your personal calendar.</p>
          </div>
          
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-full p-1 border border-slate-300 dark:border-slate-700 w-fit">
            <button
              onClick={() => setMediaType("movie")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mediaType === "movie" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <Film size={16} /> Movies
            </button>
            <button
              onClick={() => setMediaType("tv")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mediaType === "tv" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <Tv size={16} /> TV Shows
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 md:gap-4 auto-rows-fr">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-slate-50/50 dark:bg-slate-900/30 rounded-xl min-h-[100px] border border-transparent"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <div 
                      key={day} 
                      onClick={() => dayEvents.length > 0 && setSelectedDayEvents({ day, events: dayEvents })}
                      className={`min-h-[100px] md:min-h-[140px] rounded-xl border p-2 flex flex-col transition-all ${dayEvents.length > 0 ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer hover:shadow-md' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50 opacity-60'} ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="text-xs truncate font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-1 rounded">
                            {event.title || event.name}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium pl-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Day Events Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-500">{monthNames[currentDate.getMonth()]} {selectedDayEvents.day},</span>
                <span className="text-slate-600 dark:text-slate-400">{currentDate.getFullYear()}</span>
              </h3>
              <button onClick={() => setSelectedDayEvents(null)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {selectedDayEvents.events.map(event => (
                <div key={event.id} className="flex gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500/50 transition-colors group">
                  <Link to={`/${mediaType}/${event.id}`} className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {event.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w200${event.poster_path}`} alt={event.title || event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><CalendarIcon size={24} className="text-slate-400" /></div>
                    )}
                  </Link>
                  <div className="flex-1 flex flex-col justify-center">
                    <Link to={`/${mediaType}/${event.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{event.title || event.name}</h4>
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">{event.overview || "No overview available."}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <button 
                        onClick={(e) => exportToICS(e, event)}
                        className="flex items-center gap-2 text-xs font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Download size={14} /> Export .ics
                      </button>
                      <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30 px-2 py-1 rounded-md">
                        ⭐ {event.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
