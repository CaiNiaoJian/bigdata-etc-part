'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface QueryBuilderProps {
  onSearch: (params: any) => void
}

interface QueryParams {
  CP: string
  CX: string
  startDate: Date | null
  endDate: Date | null
  SFZRKMC: string
  SFZCKMC: string
  BZ: string
}

export default function QueryBuilder({ onSearch }: QueryBuilderProps) {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query.builder
  
  const [queryParams, setQueryParams] = useState<QueryParams>({
    CP: '',
    CX: '',
    startDate: null,
    endDate: null,
    SFZRKMC: '',
    SFZCKMC: '',
    BZ: ''
  })

  const handleSearch = () => {
    onSearch(queryParams)
  }

  const handleReset = () => {
    setQueryParams({
      CP: '',
      CX: '',
      startDate: null,
      endDate: null,
      SFZRKMC: '',
      SFZCKMC: '',
      BZ: ''
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 车牌号 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.plateNumber}
          </label>
          <input
            type="text"
            value={queryParams.CP}
            onChange={(e) => setQueryParams({ ...queryParams, CP: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={t.plateNumberPlaceholder}
          />
        </div>

        {/* 车型 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.vehicleType}
          </label>
          <select
            value={queryParams.CX}
            onChange={(e) => setQueryParams({ ...queryParams, CX: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t.all}</option>
            <option value="小型车">{t.smallVehicle}</option>
            <option value="中型车">{t.mediumVehicle}</option>
            <option value="大型车">{t.largeVehicle}</option>
          </select>
        </div>

        {/* 入站时间范围 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.timeRange}
          </label>
          <div className="flex gap-2">
            <DatePicker
              selected={queryParams.startDate}
              onChange={(date: Date | null) => setQueryParams({ ...queryParams, startDate: date })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholderText={t.startDate}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
            />
            <DatePicker
              selected={queryParams.endDate}
              onChange={(date: Date | null) => setQueryParams({ ...queryParams, endDate: date })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholderText={t.endDate}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </div>
        </div>

        {/* 入口收费站 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.entryStation}
          </label>
          <select
            value={queryParams.SFZRKMC}
            onChange={(e) => setQueryParams({ ...queryParams, SFZRKMC: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t.all}</option>
            <option value="广州南站">广州南站</option>
            <option value="深圳北站">深圳北站</option>
            <option value="东莞站">东莞站</option>
          </select>
        </div>

        {/* 出口收费站 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.exitStation}
          </label>
          <select
            value={queryParams.SFZCKMC}
            onChange={(e) => setQueryParams({ ...queryParams, SFZCKMC: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t.all}</option>
            <option value="惠州站">惠州站</option>
            <option value="河源站">河源站</option>
            <option value="梅州站">梅州站</option>
          </select>
        </div>

        {/* 备注 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.notes}
          </label>
          <select
            value={queryParams.BZ}
            onChange={(e) => setQueryParams({ ...queryParams, BZ: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t.all}</option>
            <option value="正常">{t.normal}</option>
            <option value="超时">{t.timeout}</option>
            <option value="未付费">{t.unpaid}</option>
          </select>
        </div>
      </div>

      {/* 按钮组 */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t.reset}
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t.search}
        </button>
      </div>
    </div>
  )
} 