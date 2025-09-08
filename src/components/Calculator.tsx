import React, { useState, useEffect } from 'react';
import { Plus, Minus, Zap, Calculator as CalcIcon, Truck, CheckCircle } from 'lucide-react';

interface CalculatorProps {
  onSchedulePickup: (orderDetails: any) => void;
}

interface ClothingItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Calculator: React.FC<CalculatorProps> = ({ onSchedulePickup }) => {
  const [selectedTab, setSelectedTab] = useState('mens');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [is24HourService, setIs24HourService] = useState(false);

  // Clothing items data
  const clothingItems: Record<string, ClothingItem[]> = {
    mens: [
      { id: 'mens-shirt', name: 'Dress Shirt', price: 4.50, category: 'mens' },
      { id: 'mens-pants', name: 'Dress Pants', price: 6.00, category: 'mens' },
      { id: 'mens-suit-jacket', name: 'Suit Jacket', price: 8.50, category: 'mens' },
      { id: 'mens-tie', name: 'Tie', price: 3.00, category: 'mens' },
      { id: 'mens-polo', name: 'Polo Shirt', price: 4.00, category: 'mens' },
      { id: 'mens-casual-shirt', name: 'Casual Shirt', price: 4.00, category: 'mens' }
    ],
    womens: [
      { id: 'womens-blouse', name: 'Blouse', price: 5.00, category: 'womens' },
      { id: 'womens-dress', name: 'Dress', price: 8.00, category: 'womens' },
      { id: 'womens-skirt', name: 'Skirt', price: 5.50, category: 'womens' },
      { id: 'womens-pants', name: 'Pants', price: 6.00, category: 'womens' },
      { id: 'womens-jacket', name: 'Jacket', price: 8.50, category: 'womens' },
      { id: 'womens-shirt', name: 'Shirt', price: 4.50, category: 'womens' }
    ],
    household: [
      { id: 'pillowcase', name: 'Pillowcase', price: 3.00, category: 'household' },
      { id: 'tablecloth', name: 'Tablecloth', price: 6.50, category: 'household' },
      { id: 'napkin', name: 'Napkin', price: 2.50, category: 'household' },
      { id: 'tea-towel', name: 'Tea Towel', price: 3.00, category: 'household' },
      { id: 'placemat', name: 'Placemat', price: 2.50, category: 'household' }
    ]
  };

  const tabs = [
    { id: 'mens', label: "Men's Clothing", icon: '👔' },
    { id: 'womens', label: "Women's Clothing", icon: '👗' },
    { id: 'household', label: 'Household Items', icon: '🏠' }
  ];

  // Add item to order
  const addItem = (item: ClothingItem) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(selected => 
          selected.id === item.id 
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from order
  const removeItem = (itemId: string) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // Calculate pricing
  const calculatePricing = () => {
    const baseTotal = selectedItems.reduce((total, item) => {
      const itemPrice = is24HourService ? item.price + 1.00 : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);

    const totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0);
    const deliveryFee = baseTotal >= 35 ? 0 : 5.00;
    const finalTotal = baseTotal + deliveryFee;

    return {
      baseTotal,
      deliveryFee,
      finalTotal,
      totalItems
    };
  };

  const pricing = calculatePricing();

  const handleSchedulePickup = () => {
    const orderDetails = {
      items: selectedItems.map(item => ({
        ...item,
        price: is24HourService ? item.price + 1.00 : item.price
      })),
      is24HourService,
      pricing
    };
    
    onSchedulePickup(orderDetails);
  };

  return (
    <section id="calculator-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
              <CalcIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Get Your <span style={{ color: '#E87461' }}>FREE Quote</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select your items and get an instant price quote. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Item Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Express Service Toggle */}
                <div className="mb-8 p-6 rounded-2xl border-2" style={{ borderColor: '#E87461', backgroundColor: '#FFF8F0' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold flex items-center space-x-2 mb-2" style={{ color: '#2C3E50' }}>
                        <Zap className="w-5 h-5" style={{ color: '#E87461' }} />
                        <span>24-Hour Express Service</span>
                      </h3>
                      <p className="text-gray-600">Add $1.00 per item for next-day return</p>
                    </div>
                    <button
                      onClick={() => setIs24HourService(!is24HourService)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        is24HourService ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          is24HourService ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap mb-8 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedTab === tab.id
                          ? 'text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg scale-105'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {clothingItems[selectedTab].map((item) => {
                    const selectedItem = selectedItems.find(selected => selected.id === item.id);
                    const displayPrice = is24HourService ? item.price + 1.00 : item.price;
                    
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-2 rounded-xl pricing-item hover:shadow-lg transition-all duration-300"
                      >
                        <div>
                          <h4 className="font-semibold" style={{ color: '#2C3E50' }}>{item.name}</h4>
                          <p className="text-lg font-bold" style={{ color: '#E87461' }}>
                            ${displayPrice.toFixed(2)}
                            {is24HourService && (
                              <span className="text-sm text-gray-500 ml-2">
                                (${item.price.toFixed(2)} + $1.00)
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {selectedItem && (
                            <>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-400 hover:bg-gray-500 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-semibold" style={{ color: '#2C3E50' }}>
                                {selectedItem.quantity}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => addItem(item)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                  Order Summary
                </h3>
                
                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Select items to see your quote
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {selectedItems.map((item) => {
                        const displayPrice = is24HourService ? item.price + 1.00 : item.price;
                        return (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-sm">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-sm font-semibold">
                              ${(displayPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {is24HourService && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-800">
                            24-Hour Express Service
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${pricing.baseTotal.toFixed(2)}</span>
                      </div>
                      
                      {pricing.deliveryFee > 0 && (
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span className="font-semibold">${pricing.deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span style={{ color: '#E87461' }}>${pricing.finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {pricing.baseTotal >= 35 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            FREE Pickup & Delivery!
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSchedulePickup}
                      className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Truck className="w-5 h-5" />
                      <span>Schedule Pickup</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;