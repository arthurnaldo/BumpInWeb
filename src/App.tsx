import { useState, useEffect } from 'react'
import { ArrowDownIcon, DevicePhoneMobileIcon, UserGroupIcon, QrCodeIcon, CreditCardIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import screenRecording from './assets/ScreenRecording_12-31-2024 20-31-24_1.mov'
import homepageImage from './assets/IMG_1407.jpg'
import networkImage from './assets/IMG_1403.jpg'

function BumpinLogo() {
  return (
    <div className="flex items-center gap-5">
      {/* Stacked cards logo */}
      <div className="relative w-16 h-16">
        {/* Bottom card */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3366CC] to-[#4C7DE6] transform rotate-[10deg] translate-x-2.5 translate-y-1.5 shadow-lg"
        ></div>
        
        {/* Middle card */}
        <div 
          className="absolute inset-0 rounded-2xl bg-white/90 shadow-md"
        ></div>
        
        {/* Top card */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-[#F2F2FF] transform -rotate-[10deg] -translate-x-2.5 -translate-y-1.5 shadow"
        >
          <svg 
            className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-[60%] -rotate-[10deg] text-[#3366CC]" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M15.5,6.5A3.5,3.5 0 0,1 12,10A3.5,3.5 0 0,1 8.5,6.5A3.5,3.5 0 0,1 12,3A3.5,3.5 0 0,1 15.5,6.5M19.5,15C19.5,12.5 16.42,10.5 12,10.5C7.58,10.5 4.5,12.5 4.5,15V18H19.5V15Z" />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      <div className="flex items-center">
        <span className="text-4xl font-black text-white font-['SF Pro Rounded'] tracking-tight">
          Bump
        </span>
        <span className="text-4xl font-black text-white/80 font-['SF Pro Rounded'] tracking-tight -ml-1">
          In
        </span>
      </div>
    </div>
  );
}

function AppStoreButton({ className = "" }: { className?: string }) {
  return (
    <a 
      href="#" 
      className={`inline-flex items-center bg-black text-white rounded-xl hover:bg-gray-800 transition-colors px-6 py-2 ${className}`}
    >
      <div className="flex flex-col leading-tight text-left">
        <span className="text-xs">Download on the</span>
        <span className="text-xl font-semibold -mt-1">App Store</span>
      </div>
      <svg className="w-8 h-8 ml-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    </a>
  );
}

function PreOrderForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      timestamp: new Date().toISOString(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      quantity: formData.get('quantity') || '50',
    }
    
    try {
      console.log('Submitting data:', data)
      
      // Save to localStorage first as backup
      const existingOrders = JSON.parse(localStorage.getItem('bumpin_orders') || '[]')
      existingOrders.push(data)
      localStorage.setItem('bumpin_orders', JSON.stringify(existingOrders))

      // Format date for Airtable (YYYY-MM-DD)
      const formattedDate = new Date().toISOString().split('T')[0]

      // Submit to Airtable
      const response = await fetch('https://api.airtable.com/v0/appxtfKAR9Xm4X0P2/tbliPO37RUkrwHslP', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pate3qrGjuWRtbYYu.c21e7a611551b7fcc099c362509b4f93a90e56aec12372026629d592d72286f0',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            fields: {
              Name: data.name,
              Email: data.email,
              Phone: data.phone,
              Address: data.address,
              Quantity: parseInt(data.quantity as string),
              Timestamp: formattedDate
            }
          }]
        })
      })

      const responseData = await response.json()
      console.log('Airtable response:', responseData)

      if (!response.ok) {
        console.error('Airtable error:', responseData)
        throw new Error(`Failed to save order: ${responseData.error?.message || 'Unknown error'}`)
      }

      onClose()
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-4">Pre-order Bumpin Cards</h3>
          <p className="text-gray-600 mb-6">
            Fill out the form below to pre-order your pack of 50 premium Bumpin cards.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(123) 456-7890"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <textarea
                name="address"
                id="address"
                required
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full shipping address"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (Packs of 50)
              </label>
              <select
                name="quantity"
                id="quantity"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="1"
              >
                <option value="1">1 Pack (50 cards) - $19.99</option>
                <option value="2">2 Packs (100 cards) - $34.99</option>
                <option value="5">5 Packs (250 cards) - $79.99</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Complete Pre-order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function AdminView() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('bumpin_orders') || '[]')
    setOrders(storedOrders)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Pre-orders</h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [showPreOrderForm, setShowPreOrderForm] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [hasOrdered, setHasOrdered] = useState(false)

  // Secret key combination to show admin view (press 'a' three times)
  useEffect(() => {
    let keypresses: string[] = []
    const handleKeyPress = (e: KeyboardEvent) => {
      keypresses.push(e.key)
      if (keypresses.length > 3) keypresses.shift()
      if (keypresses.join('') === 'aaa') {
        setShowAdmin(prev => !prev)
      }
    }
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  const handleOrderSuccess = () => {
    setShowPreOrderForm(false)
    setHasOrdered(true)
  }

  if (showAdmin) {
    return <AdminView />
  }

  return (
    <div className="min-h-screen">
      {showPreOrderForm && <PreOrderForm onClose={handleOrderSuccess} />}
      
      {/* Hero Section */}
      <header className="hero-gradient text-white">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <BumpinLogo />
            <div className="flex items-center gap-4">
              <a 
                href="#pre-order" 
                className="group relative inline-flex items-center gap-2 px-6 py-2 overflow-hidden"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 p-[1px] transition-all duration-300 group-hover:p-[2px]">
                  <div className="h-full w-full rounded-[11px] bg-white/20 backdrop-blur-sm"></div>
                </div>
                {/* Content */}
                <div className="relative flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-white transition-transform group-hover:-rotate-12" />
                  <span className="font-semibold text-white">Buy Cards</span>
                </div>
              </a>
              <AppStoreButton className="scale-90" />
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-6xl font-bold mb-8 font-display">
            Connect with Style
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto font-medium text-white/90">
            Share your contact info instantly with beautiful digital cards. 
            Network smarter, not harder.
          </p>
          
          {/* Video Showcase */}
          <div className="relative w-full h-[600px] overflow-hidden">
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline={true}
              poster="/BumpInWeb/assets/IMG_1407-CBovArgS.jpg"
            >
              <source 
                src="/BumpInWeb/assets/ScreenRecording_12-31-2024 20-31-24_1.mov" 
                type="video/quicktime"
              />
            </video>
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <AppStoreButton />
            <a href="#features" className="gradient-button bg-white bg-opacity-20 w-full sm:w-auto">
              Learn More
              <ArrowDownIcon className="w-5 h-5 inline ml-2" />
            </a>
          </div>
        </div>
      </header>

      {/* Story Section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-32">
            {/* Problem */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold mb-6">The Old Way</h3>
                <p className="text-xl text-gray-600 mb-6">
                  We've all been there - stacks of business cards collecting dust, outdated phone numbers, 
                  and that moment when you can't find the card of someone you really need to contact.
                  Traditional networking is stuck in the past.
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">✕</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Lost Opportunities</span>
                      <span className="text-sm">Cards get lost, damaged, or buried in wallets and drawers. When you need that important contact, it's nowhere to be found.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">✕</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Outdated Information</span>
                      <span className="text-sm">People change jobs, phones, and emails. Once a card is printed, it's frozen in time - and often wrong when you need it.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">✕</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Time-Consuming Process</span>
                      <span className="text-sm">Manually typing contact info into your phone, searching through stacks of cards, and managing duplicates wastes precious time.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">✕</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Environmental Waste</span>
                      <span className="text-sm">Billions of paper cards are printed each year, with most ending up in the trash. It's an unnecessary burden on our planet.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transform rotate-6 rounded-2xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                    {/* Stack of messy business cards */}
                    <div className="relative h-64 mb-4">
                      {/* Multiple scattered cards */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        {/* Card 1 - Torn and faded */}
                        <div className="absolute top-4 right-2 w-full h-full bg-gray-100 rounded-lg transform rotate-6">
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-50"></div>
                          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full transform -rotate-12"></div>
                          <div className="absolute bottom-4 left-4 w-16 h-1 bg-gray-300"></div>
                        </div>
                        
                        {/* Card 2 - Coffee stained */}
                        <div className="absolute top-2 left-4 w-full h-full bg-gray-50 rounded-lg transform -rotate-3">
                          <div className="absolute bottom-6 right-8 w-20 h-20 bg-[#C8A887] rounded-full opacity-20 blur-xl"></div>
                          <div className="absolute top-4 left-4 space-y-2">
                            <div className="h-3 w-24 bg-gray-300 rounded"></div>
                            <div className="h-2 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        
                        {/* Card 3 - Main card */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg border border-gray-200 p-6">
                          <div className="space-y-3">
                            {/* Company logo placeholder */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
                            {/* Contact details */}
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-gray-200 rounded"></div>
                              <div className="h-3 w-48 bg-gray-100 rounded"></div>
                              <div className="h-3 w-40 bg-gray-100 rounded"></div>
                            </div>
                            {/* Divider */}
                            <div className="h-px w-full bg-gray-100"></div>
                            {/* Footer details */}
                            <div className="flex justify-between">
                              <div className="h-3 w-24 bg-gray-100 rounded"></div>
                              <div className="h-3 w-24 bg-gray-100 rounded"></div>
                            </div>
                          </div>
                          {/* Crease mark */}
                          <div className="absolute top-0 right-8 w-px h-full bg-gray-100 transform -rotate-6"></div>
                        </div>
                      </div>
                      
                      {/* Additional wear and tear effects */}
                      <div className="absolute top-8 left-12 w-24 h-1 bg-gray-200 transform rotate-45"></div>
                      <div className="absolute bottom-12 right-8 w-16 h-16 rounded-full bg-gray-100 opacity-40 blur-lg"></div>
                    </div>
                    
                    {/* Card status indicators */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <CreditCardIcon className="w-4 h-4" />
                        <span>Contact info from 2019</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>✗</span>
                        <span>3 phone numbers outdated</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>✗</span>
                        <span>Water damaged</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 transform -rotate-6 rounded-2xl"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white">
                  {/* Modern digital card interface */}
                  <div className="relative h-[400px] mb-4">
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/10 rounded-xl overflow-hidden">
                      {/* Phone frame with notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl"></div>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                      
                      {/* App interface */}
                      <div className="absolute inset-0 mt-12 p-6">
                        {/* Profile section */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center">
                              <UserGroupIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-white/40 rounded-full"></div>
                              <div className="h-3 w-24 bg-white/30 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Stats/info cards */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                              <div className="space-y-2">
                                <div className="h-3 w-16 bg-white/30 rounded-full"></div>
                                <div className="h-4 w-12 bg-white/40 rounded-full"></div>
                              </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                              <div className="space-y-2">
                                <div className="h-3 w-16 bg-white/30 rounded-full"></div>
                                <div className="h-4 w-12 bg-white/40 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="space-y-3">
                            <div className="h-10 bg-white/20 rounded-xl backdrop-blur-sm"></div>
                            <div className="h-10 bg-white/10 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Dynamic elements */}
                      <div className="absolute bottom-6 inset-x-6">
                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feature indicators */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <DevicePhoneMobileIcon className="w-4 h-4" />
                      <span>Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <QrCodeIcon className="w-4 h-4" />
                      <span>Instant Scanning</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>Network Growth</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6">The Bumpin Way</h3>
                <p className="text-xl text-gray-600 mb-6">
                  Imagine having your entire professional network in your pocket, always up-to-date, 
                  and instantly accessible. Bumpin transforms how we connect, making networking 
                  effortless and meaningful.
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Always Available</span>
                      <span className="text-sm">Your digital card is always with you, ready to share. No more "I left my cards at the office" moments.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Instant Updates</span>
                      <span className="text-sm">Changed jobs or got a new phone? Update once, and everyone in your network sees the new info instantly.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Effortless Sharing</span>
                      <span className="text-sm">One quick scan and you're connected. No typing, no errors, no awkward moments fumbling with paper cards.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-1">Rich Profiles</span>
                      <span className="text-sm">Share more than just contact info - showcase your professional journey, achievements, and connections.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Future */}
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">The Future of Networking</h3>
              <p className="text-xl text-gray-600">
                Join thousands of professionals who've already switched to Bumpin. 
                Modern networking deserves modern tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Features Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">Connect & Grow Your Network</h3>
              <p className="text-xl text-gray-600">
                Bumpin isn't just about sharing contacts - it's about building meaningful professional connections.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16">
              {/* App Screenshots */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 transform rotate-3 rounded-3xl"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={networkImage} 
                        alt="Bumpin Network View" 
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={homepageImage} 
                        alt="Bumpin Home Interface" 
                        className="w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col justify-center">
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <UserGroupIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Discover Connections</h4>
                      <p className="text-gray-600">Find and connect with professionals in your network</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <QrCodeIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Quick Profile Access</h4>
                      <p className="text-gray-600">View detailed profiles with just one scan</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Stay Connected</h4>
                      <p className="text-gray-600">Keep your network updated with your latest information</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order Cards Section */}
      <section id="pre-order" className="py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">Premium Physical Cards</h3>
              <p className="text-xl mb-8 text-gray-300">
                Get your personalized Bumpin cards with embedded QR codes. Perfect for networking events, 
                business meetings, or anywhere you want to make a lasting impression.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="card-feature">
                  <div className="card-feature-icon bg-blue-500/20">
                    <CreditCardIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>Premium matte-finish cards</span>
                </li>
                <li className="card-feature">
                  <div className="card-feature-icon bg-purple-500/20">
                    <QrCodeIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <span>Unique QR code on each card</span>
                </li>
                <li className="card-feature">
                  <div className="card-feature-icon bg-blue-500/20">
                    <UserGroupIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>Instant digital profile sharing</span>
                </li>
              </ul>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    className={`gradient-button w-full sm:w-auto ${hasOrdered ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !hasOrdered && setShowPreOrderForm(true)}
                    disabled={hasOrdered}
                  >
                    {hasOrdered ? 'Pre-order Submitted' : 'Pre-order Now - $19.99'}
                  </button>
                  <span className="text-sm text-gray-400">Pack of 50 cards</span>
                </div>
                <p className="text-sm text-gray-400">
                  *Limited time pre-order price. Ships within 2-3 weeks.
                </p>
              </div>
            </div>
            <div className="card-preview">
              {/* Front of card */}
              <div className="relative mb-8">
                <div className="aspect-[1.586/1] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <div className="absolute inset-0">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                      <div className="absolute right-0 top-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                    
                    {/* Card content */}
                    <div className="relative p-6 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-display text-xl font-bold mb-1">Bumpin</div>
                          <div className="text-white/60 text-sm">Connect Instantly</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                          <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-white/30 rounded-full"></div>
                            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                          </div>
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
                        <div className="flex justify-between items-center">
                          <div className="text-white/60 text-xs">Scan to connect</div>
                          <div className="text-white/60 text-xs">bumpin.app</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
                  <QrCodeIcon className="w-8 h-8 text-gray-800" />
                </div>
              </div>
              
              {/* Back of card */}
              <div className="relative transform -rotate-6">
                <div className="aspect-[1.586/1] rounded-2xl overflow-hidden bg-white shadow-xl">
                  <div className="absolute inset-0">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:16px_16px]"></div>
                    
                    {/* QR Code area */}
                    <div className="absolute inset-6 flex flex-col items-center justify-center">
                      <div className="w-full aspect-square max-w-[180px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3">
                        <QrCodeIcon className="w-full h-full text-white" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-gray-400 text-sm">Scan to view profile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="bg-gray-50 py-32">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-8">Ready to Start Bumpin?</h3>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Download now and join thousands of users making connections the smart way.
          </p>
          <AppStoreButton className="scale-110" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="scale-75 mb-6">
              <BumpinLogo />
            </div>
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Bumpin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
