'use client'

import { useState, useEffect, useTransition } from 'react'
import { toggleRecruitmentStatus, fetchRecruitments } from './actions'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function RecruitmentManager({ initialRecruitmentStatus, initialData = [] }) {
    const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(initialRecruitmentStatus)
    const [isPending, startTransition] = useTransition()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [recruitments, setRecruitments] = useState(initialData)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        const newState = !isRecruitmentOpen
        setIsRecruitmentOpen(newState) // Optimistic update

        startTransition(async () => {
            try {
                await toggleRecruitmentStatus(newState)
            } catch (error) {
                console.error('Failed to toggle status:', error)
                setIsRecruitmentOpen(!newState) // Revert on error
                alert('Failed to update recruitment status')
            }
        })
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchRecruitments(startDate, endDate)
            setRecruitments(data)
        } catch (error) {
            console.error('Error fetching recruitments:', error)
            alert('Failed to fetch recruitment data')
        } finally {
            setLoading(false)
        }
    }

    // We don't need useEffect for initial fetch anymore as we pass initialData
    // But if we want to support refetching without filter, we can keep it or just rely on initialData
    // Let's keep it simple: initialData is used, filter triggers new fetch.


    const handleExport = () => {
        if (recruitments.length === 0) {
            alert('No data to export')
            return
        }

        const headers = ['Name', 'Reg No', 'Branch', 'Year', 'Team Preference', 'Created At']
        const csvContent = [
            headers.join(','),
            ...recruitments.map(row => [
                `"${row.name || ''}"`,
                `"${row.reg_no || ''}"`,
                `"${row.branch || ''}"`,
                `"${row.year || ''}"`,
                `"${row.team_preference || ''}"`,
                `"${row.created_at || ''}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `recruitment-data-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportPDF = () => {
        if (recruitments.length === 0) {
            alert('No data to export')
            return
        }

        const doc = new jsPDF()
        
        // Add title
        doc.setFontSize(20)
        doc.setTextColor(40, 40, 40)
        doc.text('Recruitment Applications Report', 14, 20)
        
        // Add metadata
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
        doc.text(`Total Applications: ${stats.total}`, 14, 34)
        doc.text(`Technical: ${stats.technical} | Creative: ${stats.creative} | Management: ${stats.management}`, 14, 40)
        
        // Prepare table data
        const tableData = recruitments.map(row => [
            row.name || 'N/A',
            row.reg_no || 'N/A',
            row.branch || 'N/A',
            row.year || 'N/A',
            row.team_preference || 'N/A',
            row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'
        ])
        
        // Add table
        autoTable(doc, {
            startY: 46,
            head: [['Name', 'Reg No', 'Branch', 'Year', 'Team', 'Date']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'left'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 35 },
                5: { cellWidth: 30 }
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        })
        
        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.setTextColor(150)
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            )
        }
        
        // Save the PDF
        doc.save(`recruitment-data-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    const stats = {
        total: recruitments.length,
        technical: recruitments.filter(r => r.team_preference?.toLowerCase().includes('technical')).length,
        creative: recruitments.filter(r => r.team_preference?.toLowerCase().includes('creative')).length,
        management: recruitments.filter(r => r.team_preference?.toLowerCase().includes('management')).length
    }

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/30 flex items-center justify-center border border-green-500/30">
                        <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">Recruitment Status Control</h2>
                        <p className="text-white/40 text-sm">Toggle to enable or disable student applications</p>
                    </div>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                            <div className={`w-3 h-3 rounded-full ${isRecruitmentOpen ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]'} animate-pulse`} />
                            <p className={`text-2xl font-bold ${isRecruitmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                                {isRecruitmentOpen ? 'OPEN' : 'CLOSED'}
                            </p>
                        </div>
                        <p className="text-sm text-white/40">
                            {isRecruitmentOpen 
                                ? 'Students can submit recruitment applications' 
                                : 'Recruitment applications are currently disabled'}
                        </p>
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 ${
                            isRecruitmentOpen 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                                : 'bg-white/10 border border-white/20'
                        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        title={isRecruitmentOpen ? 'Click to close recruitment' : 'Click to open recruitment'}
                    >
                        <span
                            className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                isRecruitmentOpen ? 'translate-x-[3.25rem]' : 'translate-x-1.5'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex flex-col">
                        <p className="text-white/40 text-sm mb-2">Total Applications</p>
                        <p className="text-4xl font-bold text-white">{stats.total}</p>
                    </div>
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex flex-col">
                        <p className="text-white/40 text-sm mb-2">Technical Team</p>
                        <p className="text-4xl font-bold text-blue-400">{stats.technical}</p>
                    </div>
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
                    <div className="flex flex-col">
                        <p className="text-white/40 text-sm mb-2">Creative Team</p>
                        <p className="text-4xl font-bold text-purple-400">{stats.creative}</p>
                    </div>
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
                    <div className="flex flex-col">
                        <p className="text-white/40 text-sm mb-2">Management Team</p>
                        <p className="text-4xl font-bold text-orange-400">{stats.management}</p>
                    </div>
                </div>
            </div>

            {/* Data Dashboard */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Applications Data
                    </h3>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-4 flex-1">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white/60 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500/50 transition-all"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white/60 mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="self-end px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all duration-300 font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Filtering...' : 'Apply Filter'}
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5">
                            <tr className="text-white/60 text-sm border-b border-white/10">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Reg No</th>
                                <th className="p-4 font-semibold">Branch</th>
                                <th className="p-4 font-semibold">Year</th>
                                <th className="p-4 font-semibold">Team Preference</th>
                                <th className="p-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full"></div>
                                            <p className="text-white/40">Loading applications...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : recruitments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <p className="text-white/40 text-lg">No applications found</p>
                                        <p className="text-white/20 text-sm mt-2">Applications will appear here once students submit</p>
                                    </td>
                                </tr>
                            ) : (
                                recruitments.map((row, idx) => (
                                    <tr key={`${row.id}-${idx}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{row.name}</td>
                                        <td className="p-4 font-mono text-sm text-white/80">{row.reg_no}</td>
                                        <td className="p-4 text-white/80">{row.branch}</td>
                                        <td className="p-4 text-white/80">{row.year}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                row.team_preference?.toLowerCase().includes('technical') 
                                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                    : row.team_preference?.toLowerCase().includes('creative')
                                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                            }`}>
                                                {row.team_preference}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white/60">
                                            {row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
