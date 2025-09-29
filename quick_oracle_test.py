#!/usr/bin/env python3
"""
Quick Oracle Test - Single Reading Generation
"""

import requests
import json

BASE_URL = "https://divine-insight-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def quick_test():
    print("🔮 Quick Oracle Reading Test")
    
    try:
        # Test 1: Create order for tarot_3_ppf
        print("1. Creating order for tarot_3_ppf...")
        order_data = {
            "email": "quicktest@pleyazul.com",
            "spread_id": "tarot_3_ppf",
            "custom_question": "Quick test question"
        }
        
        response = requests.post(f"{API_BASE}/checkout", json=order_data, timeout=60)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                order_id = data.get('order_id')
                print(f"   ✅ Order created: {order_id}")
                
                # Test 2: Generate reading
                print("2. Generating reading...")
                reading_data = {"order_id": order_id}
                reading_response = requests.post(f"{API_BASE}/readings/generate", json=reading_data, timeout=60)
                print(f"   Status: {reading_response.status_code}")
                
                if reading_response.status_code == 200:
                    reading_result = reading_response.json()
                    if reading_result.get('success'):
                        reading = reading_result.get('reading', {})
                        result_json = reading.get('result_json', {})
                        
                        oracle_type = result_json.get('type')
                        print(f"   ✅ Reading generated: {oracle_type}")
                        
                        if oracle_type == 'tarot':
                            cards = result_json.get('cards', [])
                            print(f"   📊 Cards: {len(cards)}")
                            for i, card in enumerate(cards):
                                print(f"      {i+1}. {card.get('name', 'Unknown')} ({card.get('position', 'No position')})")
                        
                        print("   🎉 ORACLE READING GENERATION: WORKING")
                        return True
                    else:
                        print(f"   ❌ Reading generation failed: {reading_result}")
                        return False
                else:
                    print(f"   ❌ Reading generation HTTP error: {reading_response.status_code}")
                    return False
            else:
                print(f"   ❌ Order creation failed: {data}")
                return False
        else:
            print(f"   ❌ Order creation HTTP error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = quick_test()
    print(f"\nResult: {'SUCCESS' if success else 'FAILED'}")