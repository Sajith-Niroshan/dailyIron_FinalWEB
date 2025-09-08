import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Calculator as CalcIcon, Zap, ArrowRight, Info } from 'lucide-react';

interface CalculatorProps {
  onSchedulePickup: (orderDetails: any) => void;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  quantity: number;
}

const Calculator: React.FC<CalculatorProps> = ({ onSchedulePickup }) => {
  const [activeTab, setActiveTab] = useState('men');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [is24HourService, setIs24HourService] = useState(false);

  // Clothing categories and items with prices
  const clothingData = {
    men: [
      { id: 'm1', name: 'Dress Shirt', category: 'men_formal_wear', basePrice: 3.50 },
      { id: 'm2', name: 'Polo Shirt', category: 'men_casual_wear', basePrice: 3.25 },
      { id: 'm3', name: 'T-Shirt', category: 'men_casual_wear', basePrice: 2.75 },
      { id: 'm4', name: 'Dress Pants', category: 'men_formal_wear', basePrice: 4.50 },
      { id: 'm5', name: 'Casual Pants', category: 'men_casual_wear', basePrice: 4.25 },
      { id: 'm6', name: 'Jeans', category: 'men_casual_wear', basePrice: 4.00 },
      { id: 'm7', name: 'Suit Jacket', category: 'men_formal_wear', basePrice: 7.50 },
      { id: 'm8', name: 'Casual Jacket', category: 'men_outerwear', basePrice: 6.50 },
      { id: 'm9', name: 'Hoodie', category: 'men_casual_wear', basePrice: 5.50 },
      { id: 'm10', name: 'Sweater', category: 'men_seasonal_layering', basePrice: 5.25 }
    ],
    women: [
      { id: 'w1', name: 'Blouse', category: 'women_tops_blouses', basePrice: 3.75 },
      { id: 'w2', name: 'Dress Shirt', category: 'women_tops_blouses', basePrice: 3.50 },
      { id: 'w3', name: 'T-Shirt', category: 'women_tops_blouses', basePrice: 2.75 },
      { id: 'w4', name: 'Dress Pants', category: 'women_bottoms', basePrice: 4.50 },
      { id: 'w5', name: 'Skirt', category: 'women_bottoms', basePrice: 4.25 },
      { id: 'w6', name: 'Dress', category: 'women_dresses', basePrice: 6.50 },
      { id: 'w7', name: 'Blazer', category: 'women_outerwear', basePrice: 7.25 },
      { id: 'w8', name: 'Cardigan', category: 'women_outerwear', basePrice: 5.75 },
      { id: 'w9', name: 'Jeans', category: 'women_bottoms', basePrice: 4.00 },
      { id: 'w10', name: 'Sweater', category: 'women_other_items', basePrice: 5.25 }
    ],
    household: [
      { id: 'h1', name: 'Bed Sheet (Single)', category: 'household_bedding', basePrice: 4.50 },
      { id: 'h2', name: 'Bed Sheet (Double)', category: 'household_bedding', basePrice: 5.50 },
      { id: 'h3', name: 'Pillowcase', category: 'household_bedding', basePrice: 2.50 },
      { id: 'h4', name: 'Tablecloth', category: 'household_table_linens', basePrice: 6.00 },
      { id: 'h5', name: 'Napkin', category: 'household_table_linens', basePrice: 1.50 },
      { id: 'h6', name: 'Tea Towel', category: 'household_miscellaneous', basePrice: 2.25 },
      { id: 'h7', name: 'Curtain Panel', category: 'household_window_treatments', basePrice: 8.50 },
      { id: 'h8', name: 'Bath Towel', category: 'household_bath_linens', basePrice: 4.25 },
      { id: 'h9', name: 'Hand Towel', category: 'household_bath_linens', basePrice: 3.25 },
      { id: 'h10', name: 'Duvet Cover', category: 'household_bedding', basePrice: 9.50 }
    ]
  };

  const addItem = (clothingItem: any) => {
    const existingItem = items.find(item => item.id === clothingItem.id);
    
    if (existingItem) {
      setItems(items.map(item =>
        item.id === clothingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { ...clothingItem, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: string) => {
    const existingItem = items.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setItems(items.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const clearAllItems = () => {
    setItems([]);
  };

  // Calculate pricing
  const calculatePricing = () => {
    const baseTotal = items.reduce((total, item) => {
      const itemPrice = is24HourService ? item.basePrice + 1.00 : item.basePrice;
      return total + (itemPrice * item.quantity);
    }, 0);
    
    const deliveryFee = baseTotal >= 35 ? 0 : 4.99;
    const finalTotal = baseTotal + deliveryFee;
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    
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
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: is24HourService ? item.basePrice + 1.00 : item.basePrice,
        quantity: item.quantity
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2C3E50' }}>
              Instant <span style={{ color: '#E87461' }}>Quote</span>
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#2C3E50' }}>
              Calculate your ironing cost instantly. Add items to your order and get transparent pricing.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Item Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
                  {[
                    { id: 'men', label: "Men's" },
                    { id: 'women', label: "Women's" },
                    { id: 'household', label: 'Household' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 24-Hour Service Toggle */}
                <div className="mb-8 p-6 rounded-2xl border-2 border-orange-200 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-6 h-6 text-orange-600" />
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: '#2C3E50' }}>
                          24-Hour Express Service
                        </h3>
                        <p className="text-sm opacity-70" style={{ color: '#2C3E50' }}>
                          Get your clothes back the next day (+$1.00 per item)
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={is24HourService}
                        onChange={(e) => setIs24HourService(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clothingData[activeTab as keyof typeof clothingData].map((clothingItem) => {
                    const currentItem = items.find(item => item.id === clothingItem.id);
                    const currentPrice = is24HourService ? clothingItem.basePrice + 1.00 : clothingItem.basePrice;
                    
                    return (
                      <div
                        key={clothingItem.id}
                        className="bg-white border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-orange-300"
                      >
                        <div className="text-center mb-4">
                          <h4 className="font-semibold text-lg mb-2" style={{ color: '#2C3E50' }}>
                            {clothingItem.name}
                          </h4>
                          <div className="text-2xl font-bold" style={{ color: '#E87461' }}>
                            ${currentPrice.toFixed(2)}
                          </div>
                          {is24HourService && (
                            <div className="text-xs text-orange-600 font-medium">
                              +$1.00 express
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => removeItem(clothingItem.id)}
                            disabled={!currentItem}
                            className="p-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 transition-colors"
                          >
                            <MinusCircle 
                              className={`w-6 h-6 ${currentItem ? 'text-red-500' : 'text-gray-300'}`}
                            />
                          </button>

                          <span className="w-8 text-center font-bold text-xl" style={{ color: '#2C3E50' }}>
                            {currentItem?.quantity || 0}
                          </span>

                          <button
                            onClick={() => addItem(clothingItem)}
                            className="p-2 rounded-full hover:bg-green-50 transition-colors"
                          >
                            <PlusCircle className="w-6 h-6 text-green-500" />
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
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                  Order Summary
                </h3>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <CalcIcon className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: '#2C3E50' }} />
                    <p className="opacity-60" style={{ color: '#2C3E50' }}>
                      Add items to see your quote
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                      {items.map((item) => {
                        const itemPrice = is24HourService ? item.basePrice + 1.00 : item.basePrice;
                        return (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium" style={{ color: '#2C3E50' }}>
                                {item.quantity}x {item.name}
                              </div>
                              <div className="text-sm opacity-60" style={{ color: '#2C3E50' }}>
                                ${itemPrice.toFixed(2)} each
                              </div>
                            </div>
                            <div className="font-semibold" style={{ color: '#2C3E50' }}>
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {is24HourService && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">
                            24-Hour Express Service
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span style={{ color: '#2C3E50' }}>Subtotal ({pricing.totalItems} items):</span>
                        <span>${pricing.baseTotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span style={{ color: '#2C3E50' }}>Delivery Fee:</span>
                        <span>
                          {pricing.deliveryFee === 0 ? 'FREE' : `$${pricing.deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-xl">
                          <span style={{ color: '#2C3E50' }}>Total:</span>
                          <span style={{ color: '#E87461' }}>${pricing.finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {pricing.baseTotal >= 35 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Info className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            FREE Pickup & Delivery!
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleSchedulePickup}
                        className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <span>Schedule Pickup</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={clearAllItems}
                        className="w-full py-2 px-4 rounded-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                        style={{ color: '#2C3E50' }}
                      >
                        Clear All
                      </button>
                    </div>
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