'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  TrendingDown,
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

/**
 * EXPIRATION CALENDAR VIEW
 * 
 * PURPOSE:
 * - Visual timeline of upcoming certification expirations
 * - Prevent scheduling conflicts due to expired certs
 * - Early warning system for dispatchers
 * - Export expiration reports
 * 
 * FEATURES:
 * - Calendar view with color-coded expiration indicators
 * - Daily breakdown of expiring certifications
 * - Filter by trade/certification type
 * - Export expiration schedule
 * 
 * PREVENTS:
 * - Scheduling workers whose certs will expire during job
 * - Last-minute cert renewal rushes
 * - Hidden compliance failures
 */

interface ExpirationEvent {
  date: string;
  employeeId: string;
  fullName: string;
  tradeRole: string;
  certificationType: string;
  daysUntilExpiration: number;
  severity: 'critical' | 'warning' | 'notice'; // <7, 7-14, 15-30 days
}

export default function ExpirationCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expirations, setExpirations] = useState<ExpirationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tradeFilter, setTradeFilter] = useState<string>('all');

  useEffect(() => {
    loadExpirations();
  }, [currentMonth]);

  const loadExpirations = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const res = await fetch(
        `/api/dispatch/expirations?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      if (res.ok) {
        const data = await res.json();
        setExpirations(data);
      }
    } catch (err) {
      console.error('Failed to load expirations');
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getExpirationsForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    
    return expirations.filter(exp => exp.date === dateStr);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();

  const availableTrades = Array.from(new Set(expirations.map(e => e.tradeRole)));

  const filteredExpirations = tradeFilter === 'all' 
    ? expirations 
    : expirations.filter(e => e.tradeRole === tradeFilter);

  const selectedDateExpirations = selectedDate 
    ? filteredExpirations.filter(e => e.date === selectedDate)
    : [];

  const exportExpirations = () => {
    const csv = [
      ['Date', 'Employee ID', 'Name', 'Trade', 'Certification', 'Days Until Expiration', 'Severity'].join(','),
      ...filteredExpirations.map(exp => [
        exp.date,
        exp.employeeId,
        exp.fullName,
        exp.tradeRole,
        exp.certificationType,
        exp.daysUntilExpiration,
        exp.severity.toUpperCase()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expiration-calendar-${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}.csv`;
    a.click();
  };

  const stats = {
    critical: filteredExpirations.filter(e => e.severity === 'critical').length,
    warning: filteredExpirations.filter(e => e.severity === 'warning').length,
    notice: filteredExpirations.filter(e => e.severity === 'notice').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dispatch">
          <button className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Dispatch Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Expiration Calendar</h1>
        </div>
        <p className="text-slate-400">Upcoming certification expirations — plan ahead</p>
      </div>

      {/* Stats & Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-red-300">Critical (&lt;7 days)</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
        </div>

        <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-amber-300">Warning (7-14 days)</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.warning}</div>
        </div>

        <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-300">Notice (15-30 days)</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.notice}</div>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center">
          <button
            onClick={exportExpirations}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            <Download className="w-4 h-4" />
            Export Schedule
          </button>
        </div>
      </div>

      {/* Trade Filter */}
      {availableTrades.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Filter by trade:</span>
          <button
            onClick={() => setTradeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              tradeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Trades
          </button>
          {availableTrades.map(trade => (
            <button
              key={trade}
              onClick={() => setTradeFilter(trade)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                tradeFilter === trade
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells before first day */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  .toISOString()
                  .split('T')[0];
                const dayExpirations = getExpirationsForDate(day).filter(exp => 
                  tradeFilter === 'all' || exp.tradeRole === tradeFilter
                );
                const hasCritical = dayExpirations.some(e => e.severity === 'critical');
                const hasWarning = dayExpirations.some(e => e.severity === 'warning');
                const hasNotice = dayExpirations.some(e => e.severity === 'notice');

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square p-2 rounded-lg border-2 hover:border-blue-500 ${
                      selectedDate === dateStr
                        ? 'border-blue-500 bg-blue-900/30'
                        : hasCritical
                        ? 'border-red-600 bg-red-900/20'
                        : hasWarning
                        ? 'border-amber-600 bg-amber-900/20'
                        : hasNotice
                        ? 'border-blue-600 bg-blue-900/20'
                        : 'border-slate-700 bg-slate-900/50'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    {dayExpirations.length > 0 && (
                      <div className={`text-xs font-bold ${
                        hasCritical
                          ? 'text-red-400'
                          : hasWarning
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}>
                        {dayExpirations.length}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 sticky top-6">
            <h3 className="font-bold mb-4">
              {selectedDate 
                ? new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Select a date'}
            </h3>

            {selectedDate && selectedDateExpirations.length === 0 && (
              <p className="text-slate-500 text-sm">No expirations on this date</p>
            )}

            {selectedDate && selectedDateExpirations.length > 0 && (
              <div className="space-y-3">
                {selectedDateExpirations.map((exp, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      exp.severity === 'critical'
                        ? 'bg-red-900/20 border-red-800/50'
                        : exp.severity === 'warning'
                        ? 'bg-amber-900/20 border-amber-800/50'
                        : 'bg-blue-900/20 border-blue-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {exp.severity === 'critical' ? (
                        <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      ) : exp.severity === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{exp.fullName}</div>
                        <div className="text-xs text-slate-400">{exp.employeeId}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-1">{exp.certificationType}</div>
                    <div className={`text-xs font-medium ${
                      exp.severity === 'critical'
                        ? 'text-red-400'
                        : exp.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}>
                      Expires in {exp.daysUntilExpiration} days
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
