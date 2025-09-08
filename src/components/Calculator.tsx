import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Plus, Minus, Clock, Info } from 'lucide-react';
import { ClothingItemService } from '../services/clothingItemService';
import { type ClothingItem } from '../lib/supabase';

interface ClothingItemWithQuantity {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

// Define the structure for categorized items
interface CategorizedItems {
  men: {
    'Formal Wear': ClothingItemWithQuantity[];
    'Casual Wear': ClothingItemWithQuantity[];
    'Ethnic / Cultural Wear': ClothingItemWithQuantity[];
    'Outerwear': ClothingItemWithQuantity[];
    'Seasonal / Layering Items': ClothingItemWithQuantity[];
  };
  women: {
    'Tops & Blouses': ClothingItemWithQuantity[];
    'Bottoms': ClothingItemWithQuantity[];
    'Dresses': ClothingItemWithQuantity[];
    'Ethnic / Cultural Wear': ClothingItemWithQuantity[];
    'Outerwear': ClothingItemWithQuantity[];
    'Other Items': ClothingItemWithQuantity[];
  };
  household: {
    'Bedding': ClothingItemWithQuantity[];
    'Table Linens': ClothingItemWithQuantity[];
    'Window Treatments': ClothingItemWithQuantity[];
    'Bath Linens': ClothingItemWithQuantity[];
    'Miscellaneous': ClothingItemWithQuantity[];
  };
}

interface CalculatorProps {
  onSchedulePickup: (orderDetails: any) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSchedulePickup }) => {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'household'>('men');
  const [is24HourService, setIs24HourService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a single state for all categorized items
  const [categorizedItems, setCategorizedItems] = useState<CategorizedItems>({
    men: {
      'Formal Wear': [],
      'Casual Wear': [],
      'Ethnic / Cultural Wear': [],
      'Outerwear': [],
      'Seasonal / Layering Items': [],
    },
    women: {
      'Tops & Blouses': [],
      'Bottoms': [],
      'Dresses': [],
      'Ethnic / Cultural Wear': [],
      'Outerwear': [],
      'Other Items': [],
    },
    household: {
      'Bedding': [],
      'Table Linens': [],
      'Window Treatments': [],
      'Bath Linens': [],
      'Miscellaneous': [],
    },
  });

  // Helper to map database categories to display names
  const categoryMap: { [key: string]: string } = {
    'men_formal_wear': 'Formal Wear',
    'men_casual_wear': 'Casual Wear',
    'men_ethnic_cultural_wear': 'Ethnic / Cultural Wear',
    'men_outerwear': 'Outerwear',
    'men_seasonal_layering': 'Seasonal / Layering Items',
    'women_tops_blouses': 'Tops & Blouses',
    'women_bottoms': 'Bottoms',
    'women_dresses': 'Dresses',
    'women_ethnic_cultural_wear': 'Ethnic / Cultural Wear',
    'women_outerwear': 'Outerwear',
    'women_other_items': 'Other Items',
    'household_bedding': 'Bedding',
    'household_table_linens': 'Table Linens',
    'household_window_treatments': 'Window Treatments',
    'household_bath_linens': 'Bath Linens',
    'household_miscellaneous': 'Miscellaneous',
  };

  // Fetch clothing items from database
  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!import.meta.env.VITE_SUPABASE_URL || 
            import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
          console.warn('Supabase not configured, using fallback items');
          throw new Error('Database not configured');
        }
        
        const items = await ClothingItemService.getClothingItems({
          isActive: true
        });

        const newCategorizedItems: CategorizedItems = {
          men: {
            'Formal Wear': [],
            'Casual Wear': [],
            'Ethnic / Cultural Wear': [],
            'Outerwear': [],
            'Seasonal / Layering Items': [],
          },
          women: {
            'Tops & Blouses': [],
            'Bottoms': [],
            'Dresses': [],
            'Ethnic / Cultural Wear': [],
            'Outerwear': [],
            'Other Items': [],
          },
          household: {
            'Bedding': [],
            'Table Linens': [],
            'Window Treatments': [],
            'Bath Linens': [],
            'Miscellaneous': [],
          },
        };

        items.forEach(item => {
          // Helper function to safely convert price to number
          const safePrice = (price: any): number => {
            const converted = Number(price);
            return isNaN(converted) ? 0 : converted;
          };

          const displayCategory = categoryMap[item.category];
          if (displayCategory) {
            if (item.category.startsWith('men_')) {
              newCategorizedItems.men[displayCategory as keyof typeof newCategorizedItems.men]?.push({
                id: item.id,
                name: item.name,
                price: safePrice(item.base_price),
                quantity: 0,
                category: item.category
              });
            } else if (item.category.startsWith('women_')) {
              newCategorizedItems.women[displayCategory as keyof typeof newCategorizedItems.women]?.push({
                id: item.id,
                name: item.name,
                price: safePrice(item.base_price),
                quantity: 0,
                category: item.category
              });
            } else if (item.category.startsWith('household_')) {
              newCategorizedItems.household[displayCategory as keyof typeof newCategorizedItems.household]?.push({
                id: item.id,
                name: item.name,
                price: safePrice(item.base_price),
                quantity: 0,
                category: item.category
              });
            }
          }
        });

        setCategorizedItems(newCategorizedItems);

      } catch (err) {
        console.warn('Using fallback pricing (database not available):', err);
        setError('Using default pricing - connect to Supabase for live pricing');
        
        // Fallback to hardcoded items if database fetch fails
        setCategorizedItems({
          men: {
            'Formal Wear': [
              { id: 'm-f-1', name: 'Dress shirts (short or long sleeve)', price: 3.50, quantity: 0, category: 'men_formal_wear' },
              { id: 'm-f-2', name: 'Dress pants / trousers', price: 4.00, quantity: 0, category: 'men_formal_wear' },
              { id: 'm-f-3', name: 'Blazers / suit jackets', price: 8.00, quantity: 0, category: 'men_formal_wear' },
              { id: 'm-f-4', name: 'Ties', price: 2.00, quantity: 0, category: 'men_formal_wear' },
              { id: 'm-f-5', name: 'Waistcoats (vests)', price: 6.00, quantity: 0, category: 'men_formal_wear' },
            ],
            'Casual Wear': [
              { id: 'm-c-1', name: 'T-shirts', price: 2.50, quantity: 0, category: 'men_casual_wear' },
              { id: 'm-c-2', name: 'Casual button-up shirts', price: 3.00, quantity: 0, category: 'men_casual_wear' },
              { id: 'm-c-3', name: 'Jeans', price: 4.00, quantity: 0, category: 'men_casual_wear' },
              { id: 'm-c-4', name: 'Chinos / khakis', price: 3.50, quantity: 0, category: 'men_casual_wear' },
              { id: 'm-c-5', name: 'Casual shorts', price: 3.00, quantity: 0, category: 'men_casual_wear' },
            ],
            'Ethnic / Cultural Wear': [
              { id: 'm-e-1', name: 'Kurta Tops', price: 7.00, quantity: 0, category: 'men_ethnic_cultural_wear' },
              { id: 'm-e-2', name: 'Kurta pants', price: 5.00, quantity: 0, category: 'men_ethnic_cultural_wear' },
            ],
            'Outerwear': [
              { id: 'm-o-1', name: 'Sweaters', price: 5.00, quantity: 0, category: 'men_outerwear' },
              { id: 'm-o-2', name: 'Hoodies', price: 5.00, quantity: 0, category: 'men_outerwear' },
            ],
            'Seasonal / Layering Items': [
              { id: 'm-s-1', name: 'Flannel shirts', price: 3.50, quantity: 0, category: 'men_seasonal_layering' },
            ],
          },
          women: {
            'Tops & Blouses': [
              { id: 'w-tb-1', name: 'T-shirts', price: 2.50, quantity: 0, category: 'women_tops_blouses' },
              { id: 'w-tb-2', name: 'Blouses', price: 4.00, quantity: 0, category: 'women_tops_blouses' },
              { id: 'w-tb-3', name: 'Dress shirts', price: 3.50, quantity: 0, category: 'women_tops_blouses' },
              { id: 'w-tb-4', name: 'Long-sleeve tops', price: 3.50, quantity: 0, category: 'women_tops_blouses' },
              { id: 'w-tb-5', name: 'Button-up shirts', price: 3.50, quantity: 0, category: 'women_tops_blouses' },
            ],
            'Bottoms': [
              { id: 'w-b-1', name: 'Pants / trousers', price: 4.00, quantity: 0, category: 'women_bottoms' },
              { id: 'w-b-2', name: 'Jeans', price: 4.00, quantity: 0, category: 'women_bottoms' },
              { id: 'w-b-3', name: 'Skirts (mini, midi, maxi)', price: 4.50, quantity: 0, category: 'women_bottoms' },
              { id: 'w-b-4', name: 'Shorts', price: 3.00, quantity: 0, category: 'women_bottoms' },
            ],
            'Dresses': [
              { id: 'w-d-1', name: 'Casual dresses', price: 7.00, quantity: 0, category: 'women_dresses' },
              { id: 'w-d-2', name: 'Formal dresses', price: 10.00, quantity: 0, category: 'women_dresses' },
              { id: 'w-d-3', name: 'Office/work dresses', price: 8.00, quantity: 0, category: 'women_dresses' },
            ],
            'Ethnic / Cultural Wear': [
              { id: 'w-e-1', name: 'Sarees (2 Piece - blouse and saree piece)', price: 15.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-2', name: 'Salwar kameez (top)', price: 7.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-3', name: 'Salwar kameez (bottom)', price: 5.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-4', name: 'Salwar kameez (dupatta)', price: 3.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-5', name: 'Kurta Tops', price: 7.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-6', name: 'Kurta pants', price: 5.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-7', name: 'Abayas', price: 8.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-8', name: 'Sarongs/Lungi', price: 4.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
              { id: 'w-e-9', name: 'Hijabs or shawls', price: 3.00, quantity: 0, category: 'women_ethnic_cultural_wear' },
            ],
            'Outerwear': [
              { id: 'w-o-1', name: 'Cardigans', price: 5.00, quantity: 0, category: 'women_outerwear' },
              { id: 'w-o-2', name: 'Blazers', price: 8.00, quantity: 0, category: 'women_outerwear' },
            ],
            'Other Items': [
              { id: 'w-oi-1', name: 'Nightgowns / sleepwear', price: 4.00, quantity: 0, category: 'women_other_items' },
              { id: 'w-oi-2', name: 'Aprons (clothing)', price: 3.00, quantity: 0, category: 'women_other_items' },
            ],
          },
          household: {
            'Bedding': [
              { id: 'h-b-1', name: 'Single Bedsheet', price: 8.00, quantity: 0, category: 'household_bedding' },
              { id: 'h-b-2', name: 'Double Bedsheet', price: 10.00, quantity: 0, category: 'household_bedding' },
              { id: 'h-b-3', name: 'Queen Bedsheet', price: 12.00, quantity: 0, category: 'household_bedding' },
              { id: 'h-b-4', name: 'King Bedsheet', price: 15.00, quantity: 0, category: 'household_bedding' },
              { id: 'h-b-5', name: 'Pillowcase', price: 3.00, quantity: 0, category: 'household_bedding' },
            ],
            'Table Linens': [
              { id: 'h-tl-1', name: 'Small Tablecloth', price: 8.00, quantity: 0, category: 'household_table_linens' },
              { id: 'h-tl-2', name: 'Medium Tablecloth', price: 12.00, quantity: 0, category: 'household_table_linens' },
              { id: 'h-tl-3', name: 'Large Tablecloth', price: 16.00, quantity: 0, category: 'household_table_linens' },
            ],
            'Window Treatments': [
              { id: 'h-wt-1', name: 'Small Curtain Panel', price: 10.00, quantity: 0, category: 'household_window_treatments' },
              { id: 'h-wt-2', name: 'Medium Curtain Panel', price: 15.00, quantity: 0, category: 'household_window_treatments' },
              { id: 'h-wt-3', name: 'Large Curtain Panel', price: 20.00, quantity: 0, category: 'household_window_treatments' },
            ],
            'Bath Linens': [
              { id: 'h-bl-1', name: 'Bath Towel', price: 5.00, quantity: 0, category: 'household_bath_linens' },
              { id: 'h-bl-2', name: 'Hand Towel', price: 3.00, quantity: 0, category: 'household_bath_linens' },
            ],
            'Miscellaneous': [
              { id: 'h-m-1', name: 'Throw Blanket', price: 12.00, quantity: 0, category: 'household_miscellaneous' },
              { id: 'h-m-2', name: 'Comforter/Duvet', price: 25.00, quantity: 0, category: 'household_miscellaneous' },
            ],
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  const updateQuantity = (mainCategory: 'men' | 'women' | 'household', subCategory: string, index: number, delta: number) => {
    setCategorizedItems(prevItems => {
      const newItems = { ...prevItems };
      const currentSubCategoryItems = newItems[mainCategory][subCategory as keyof typeof newItems[typeof mainCategory]];
      
      if (currentSubCategoryItems) {
        const updatedSubCategoryItems = [...currentSubCategoryItems];
        // Create a new item object with updated quantity to ensure immutability
        updatedSubCategoryItems[index] = {
          ...updatedSubCategoryItems[index],
          quantity: Math.max(0, updatedSubCategoryItems[index].quantity + delta)
        };
        newItems[mainCategory] = {
          ...newItems[mainCategory],
          [subCategory]: updatedSubCategoryItems
        };
      }
      return newItems;
    });
  };

  const calculatePricing = () => {
    let baseTotal = 0;
    let totalItems = 0;
    
    // Iterate through all categorized items to calculate total
    Object.values(categorizedItems).forEach(mainCat => {
      Object.values(mainCat).forEach(subCatItems => {
        subCatItems.forEach(item => {
          if (item.quantity > 0) {
            const itemPrice = is24HourService ? item.price + 1.00 : item.price;
            baseTotal += itemPrice * item.quantity;
            totalItems += item.quantity;
          }
        });
      });
    });

    const deliveryFee = (baseTotal > 0 && baseTotal < 35) ? 5.00 : 0;
    const finalTotal = baseTotal + deliveryFee;
    
    return {
      baseTotal,
      deliveryFee,
      finalTotal,
      totalItems,
      surchargePerItem: is24HourService ? 1.00 : 0,
      qualifiesForFreeDelivery: baseTotal >= 35
    };
  };

  const pricing = calculatePricing();
  const hasItems = pricing.totalItems > 0;

  const handleSchedulePickup = () => {
    const selectedItems: any[] = [];
    Object.values(categorizedItems).forEach(mainCat => {
      Object.values(mainCat).forEach(subCatItems => {
        subCatItems.forEach(item => {
          if (item.quantity > 0) {
            selectedItems.push(item);
          }
        });
      });
    });

    const orderDetails = {
      items: selectedItems,
      is24HourService,
      pricing,
      timestamp: new Date().toISOString()
    };

    onSchedulePickup(orderDetails);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-16" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto" id="calculator-section">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <CalcIcon className="w-8 h-8" style={{ color: '#E87461' }} />
                <h2 className="text-4xl font-bold" style={{ color: '#2C3E50' }}>Get Your Quote</h2>
              </div>
              <p className="text-xl" style={{ color: '#2C3E50' }}>
                Loading clothing items...
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto" id="calculator-section">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <CalcIcon className="w-8 h-8" style={{ color: '#E87461' }} />
              <h2 className="text-4xl font-bold" style={{ color: '#2C3E50' }}>Get Your Quote</h2>
            </div>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Not sure what it'll cost?<br />
              Use our quote tool — no sign-up needed.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                {error}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Service Options */}
            <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6" style={{ color: '#E87461' }} />
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#2C3E50' }}>
                      24-Hour Express Service
                    </h3>
                    <p className="text-sm" style={{ color: '#2C3E50' }}>
                      Get your items back within 24 hours (+$1.00 per item)
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            {/* Clothing Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('men')}
                className={`w-full sm:w-auto sm:flex-1 py-3 px-4 rounded-md font-medium transition-all mb-2 sm:mb-0 ${
                  activeTab === 'men' ? 'tab-active' : 'hover:bg-gray-200'
                }`}
                style={{ color: activeTab === 'men' ? 'white' : '#2C3E50' }}
              >
                Men's Clothing
              </button>
              <button
                onClick={() => setActiveTab('women')}
                className={`w-full sm:w-auto sm:flex-1 py-3 px-4 rounded-md font-medium transition-all mb-2 sm:mb-0 ${
                  activeTab === 'women' ? 'tab-active' : 'hover:bg-gray-200'
                }`}
                style={{ color: activeTab === 'women' ? 'white' : '#2C3E50' }}
              >
                Women's Clothing
              </button>
              <button
                onClick={() => setActiveTab('household')}
                className={`w-full sm:w-auto sm:flex-1 py-3 px-4 rounded-md font-medium transition-all mb-2 sm:mb-0 ${
                  activeTab === 'household' ? 'tab-active' : 'hover:bg-gray-200'
                }`}
                style={{ color: activeTab === 'household' ? 'white' : '#2C3E50' }}
              >
                Household Items
              </button>
            </div>

            {/* Items Grid */}
            <div className="space-y-8">
              {Object.entries(categorizedItems[activeTab]).map(([subCategoryName, itemsInSubCategory]) => (
                itemsInSubCategory.length > 0 && (
                  <div key={subCategoryName} className="stagger-animation">
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#2C3E50' }}>{subCategoryName}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {itemsInSubCategory.map((item, index) => {
                        const effectivePrice = is24HourService ? item.price + 1.00 : item.price;
                        
                        return (
                          <div key={item.id} className="pricing-item border rounded-lg p-4 card-hover">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium" style={{ color: '#2C3E50' }}>{item.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <p className="font-semibold" style={{ color: '#E87461' }}>
                                    ${effectivePrice.toFixed(2)}
                                  </p>
                                  {is24HourService && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                                      +$1.00
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateQuantity(activeTab, subCategoryName, index, -1)}
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all button-hover-effect"
                                  disabled={item.quantity === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(activeTab, subCategoryName, index, 1)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center button-hover-effect bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 hover:scale-110"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {item.quantity > 0 && (
                              <div className="text-right" style={{ color: '#2C3E50' }}>
                                Subtotal: ${(effectivePrice * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
              {/* Fallback if no items in any sub-category for the active tab */}
              {Object.values(categorizedItems[activeTab]).every(subCatItems => subCatItems.length === 0) && (
                <div className="col-span-2 text-center py-8">
                  <p style={{ color: '#2C3E50' }}>
                    No {activeTab === 'men' ? "men's" : activeTab === 'women' ? "women's" : "household"} items available. 
                    Please contact us for custom pricing.
                  </p>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="border-t pt-6 mt-8">
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg" style={{ color: '#2C3E50' }}>Subtotal:</span>
                    <span className="text-lg font-medium" style={{ color: '#2C3E50' }}>
                      ${pricing.baseTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {is24HourService && hasItems && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#2C3E50' }}>
                        24-Hour Service ({pricing.totalItems} items × $1.00):
                      </span>
                      <span style={{ color: '#E87461' }}>
                        +${(pricing.totalItems * 1.00).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {pricing.deliveryFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#2C3E50' }}>Delivery Fee:</span>
                      <span style={{ color: '#E87461' }}>+${pricing.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#2C3E50' }}>Total:</span>
                    <span className="text-3xl font-bold" style={{ color: '#E87461' }}>
                      ${pricing.finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {hasItems && (
                  <div className="space-y-2">
                    {pricing.qualifiesForFreeDelivery ? (
                      <div className="flex items-center font-medium" style={{ color: '#4285F4' }}>
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#4285F4' }}></div>
                        FREE Pickup & Delivery Included!
                      </div>
                    ) : (
                      <div className="flex items-center text-sm" style={{ color: '#2C3E50' }}>
                        <Info className="w-4 h-4 mr-2" style={{ color: '#E87461' }} />
                        {pricing.deliveryFee > 0 ? (
                          <span>
                            Add ${(35 - pricing.baseTotal).toFixed(2)} more to remove delivery fee
                          </span>
                        ) : (
                          <span>
                            Add ${(35 - pricing.baseTotal).toFixed(2)} more for FREE pickup & delivery
                          </span>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={handleSchedulePickup}
                      className="w-full py-3 px-6 rounded-lg font-medium button-hover-effect mt-4 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Schedule Pickup - ${pricing.finalTotal.toFixed(2)}
                    </button>
                  </div>
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