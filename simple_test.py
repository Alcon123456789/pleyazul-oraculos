#!/usr/bin/env python3
"""
Simple test for enhanced Pleyazul Oráculos features
"""

import requests
import json
import time
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://divine-insight-1.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def test_demo_endpoint():
    """Test the new demo reading endpoint"""
    print("Testing demo reading endpoint...")
    
    try:
        demo_data = {
            "email": "demo@test.com",
            "spread_id": "tarot_3_ppf"
        }
        
        response = requests.post(f"{API_BASE}/demo/reading", 
                               json=demo_data, 
                               timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('demo'):
                reading = data.get('reading', {})
                if reading.get('is_demo') and reading.get('order_id', '').startswith('demo_'):
                    print("✅ Demo endpoint working correctly")
                    print(f"   Demo order ID: {reading.get('order_id')}")
                    return True
                else:
                    print("❌ Demo reading not properly marked")
                    return False
            else:
                print(f"❌ Demo generation failed: {data}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing demo endpoint: {e}")
        return False

def test_content_media():
    """Test media fields in content"""
    print("Testing media support in content...")
    
    try:
        # Test tarot cards have image fields
        response = requests.get(f"{API_BASE}/content/tarot", timeout=15)
        if response.status_code == 200:
            tarot_data = response.json()
            if isinstance(tarot_data, list) and len(tarot_data) > 0:
                cards_with_images = [card for card in tarot_data if 'image' in card]
                print(f"✅ Tarot: {len(cards_with_images)}/{len(tarot_data)} cards have image fields")
            else:
                print("❌ No tarot data available")
                return False
        else:
            print(f"❌ Cannot load tarot data: HTTP {response.status_code}")
            return False
        
        # Test meditation content
        response = requests.get(f"{API_BASE}/content/meditaciones", timeout=15)
        if response.status_code == 200:
            meditation_data = response.json()
            if isinstance(meditation_data, list) and len(meditation_data) > 0:
                meditations_with_images = [med for med in meditation_data if 'image' in med]
                meditations_with_audio = [med for med in meditation_data if 'audio_url' in med]
                print(f"✅ Meditations: {len(meditations_with_images)} have images, {len(meditations_with_audio)} have audio")
                return True
            else:
                print("❌ No meditation data available")
                return False
        else:
            print(f"❌ Cannot load meditation data: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing media support: {e}")
        return False

def main():
    print("🔮 Simple Enhanced Features Test")
    print("=" * 40)
    
    # Test 1: Demo functionality
    demo_result = test_demo_endpoint()
    
    # Test 2: Media support
    media_result = test_content_media()
    
    print("\n" + "=" * 40)
    print("📊 RESULTS:")
    print(f"Demo Functionality: {'✅ PASS' if demo_result else '❌ FAIL'}")
    print(f"Media Support: {'✅ PASS' if media_result else '❌ FAIL'}")
    
    if demo_result and media_result:
        print("\n🎉 Enhanced features are working!")
        return True
    else:
        print("\n⚠️ Some enhanced features need attention")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)