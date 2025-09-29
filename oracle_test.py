#!/usr/bin/env python3
"""
Focused Oracle Reading Generation Test
Tests the core oracle functionality with updated content
"""

import requests
import json
import time

BASE_URL = "https://divine-insight-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_oracle_reading_generation():
    """Test oracle reading generation for all spread types"""
    
    print("🔮 Testing Oracle Reading Generation")
    print("=" * 50)
    
    # Test data for different spreads
    test_spreads = [
        ("tarot_3_ppf", "Tarot 3 Cards (Past-Present-Future)"),
        ("tarot_5_claridad", "Tarot 5 Cards (Clarity Spread)"),
        ("iching_1", "I Ching Single Hexagram"),
        ("rueda_3", "Rueda 3 Animals"),
        ("rueda_astral", "Rueda Astral 5 Animals")
    ]
    
    results = []
    
    for spread_id, spread_name in test_spreads:
        print(f"\n🎯 Testing {spread_name} ({spread_id})")
        
        try:
            # Step 1: Create order
            order_data = {
                "email": "oracle.test@pleyazul.com",
                "spread_id": spread_id,
                "custom_question": f"Test question for {spread_name}"
            }
            
            print("  📝 Creating order...")
            checkout_response = requests.post(f"{API_BASE}/checkout", json=order_data, timeout=30)
            
            if checkout_response.status_code != 200:
                print(f"  ❌ Order creation failed: {checkout_response.status_code}")
                results.append((spread_id, False, f"Order creation failed: {checkout_response.status_code}"))
                continue
            
            checkout_data = checkout_response.json()
            if not checkout_data.get('success'):
                print(f"  ❌ Order creation unsuccessful: {checkout_data}")
                results.append((spread_id, False, f"Order creation unsuccessful"))
                continue
            
            order_id = checkout_data.get('order_id')
            print(f"  ✅ Order created: {order_id}")
            
            # Step 2: Generate reading
            print("  🔮 Generating reading...")
            reading_data = {"order_id": order_id}
            reading_response = requests.post(f"{API_BASE}/readings/generate", json=reading_data, timeout=30)
            
            if reading_response.status_code != 200:
                print(f"  ❌ Reading generation failed: {reading_response.status_code}")
                results.append((spread_id, False, f"Reading generation failed: {reading_response.status_code}"))
                continue
            
            reading_result = reading_response.json()
            if not reading_result.get('success'):
                print(f"  ❌ Reading generation unsuccessful: {reading_result}")
                results.append((spread_id, False, f"Reading generation unsuccessful"))
                continue
            
            # Step 3: Validate reading content
            reading = reading_result.get('reading', {})
            result_json = reading.get('result_json', {})
            
            oracle_type = result_json.get('type')
            print(f"  📊 Oracle type: {oracle_type}")
            
            # Validate based on oracle type
            if oracle_type == 'tarot':
                cards = result_json.get('cards', [])
                expected_cards = 3 if spread_id == 'tarot_3_ppf' else 5
                
                if len(cards) == expected_cards:
                    print(f"  ✅ Tarot reading generated with {len(cards)} cards")
                    
                    # Check card structure
                    for i, card in enumerate(cards):
                        if 'name' in card and 'position' in card and 'reversed' in card:
                            print(f"    Card {i+1}: {card['name']} ({'Reversed' if card['reversed'] else 'Upright'}) - {card['position']}")
                        else:
                            print(f"    ⚠️ Card {i+1} missing required fields")
                    
                    results.append((spread_id, True, f"Generated {len(cards)} tarot cards successfully"))
                else:
                    print(f"  ❌ Expected {expected_cards} cards, got {len(cards)}")
                    results.append((spread_id, False, f"Wrong number of cards: expected {expected_cards}, got {len(cards)}"))
                    
            elif oracle_type == 'iching':
                hexagram = result_json.get('hexagram', {})
                
                if 'nombre' in hexagram and 'consejo' in hexagram:
                    print(f"  ✅ I Ching reading generated: {hexagram['nombre']}")
                    print(f"    Advice: {hexagram['consejo'][:100]}...")
                    results.append((spread_id, True, f"Generated I Ching hexagram: {hexagram['nombre']}"))
                else:
                    print(f"  ❌ I Ching hexagram missing required fields")
                    results.append((spread_id, False, "I Ching hexagram incomplete"))
                    
            elif oracle_type == 'rueda':
                animals = result_json.get('animals', [])
                expected_animals = 3 if spread_id == 'rueda_3' else 5
                
                if len(animals) == expected_animals:
                    print(f"  ✅ Rueda reading generated with {len(animals)} animals")
                    
                    # Check animal structure
                    for i, animal in enumerate(animals):
                        if 'animal' in animal and 'position' in animal and 'medicina' in animal:
                            print(f"    Animal {i+1}: {animal['animal']} - {animal['position']}")
                        else:
                            print(f"    ⚠️ Animal {i+1} missing required fields")
                    
                    results.append((spread_id, True, f"Generated {len(animals)} animals successfully"))
                else:
                    print(f"  ❌ Expected {expected_animals} animals, got {len(animals)}")
                    results.append((spread_id, False, f"Wrong number of animals: expected {expected_animals}, got {len(animals)}"))
            else:
                print(f"  ❌ Unknown oracle type: {oracle_type}")
                results.append((spread_id, False, f"Unknown oracle type: {oracle_type}"))
                
        except Exception as e:
            print(f"  ❌ Error testing {spread_id}: {str(e)}")
            results.append((spread_id, False, f"Exception: {str(e)}"))
    
    # Summary
    print("\n" + "=" * 50)
    print("🔮 ORACLE READING TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    print(f"Total Spreads Tested: {total}")
    print(f"Successful: {passed} ✅")
    print(f"Failed: {total - passed} ❌")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed < total:
        print("\n❌ FAILED TESTS:")
        for spread_id, success, message in results:
            if not success:
                print(f"  - {spread_id}: {message}")
    
    return passed == total

if __name__ == "__main__":
    success = test_oracle_reading_generation()
    exit(0 if success else 1)