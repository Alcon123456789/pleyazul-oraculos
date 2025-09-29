#!/usr/bin/env python3
"""
Pleyazul Oráculos PWA Backend Testing Suite
Tests all backend API endpoints and functionality
"""

import requests
import json
import time
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://divine-insight-1.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

class PleyazulBackendTester:
    def __init__(self):
        self.test_results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'PleyazulTester/1.0'
        })
        
    def log_test(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_api_status(self):
        """Test API status and health check"""
        try:
            response = self.session.get(f"{API_BASE}/status")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ['status', 'service', 'timestamp', 'integrations']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("API Status", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Check integrations
                integrations = data.get('integrations', {})
                expected_integrations = ['paypal', 'telegram', 'testMode']
                
                for integration in expected_integrations:
                    if integration not in integrations:
                        self.log_test("API Status", False, f"Missing integration: {integration}", data)
                        return False
                
                self.log_test("API Status", True, "API is healthy and responding correctly", data)
                return True
            else:
                self.log_test("API Status", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("API Status", False, f"Connection error: {str(e)}")
            return False
    
    def test_content_endpoints(self):
        """Test all content loading endpoints"""
        content_types = ['tarot', 'iching', 'rueda', 'spreads', 'presets', 'meditaciones']
        all_passed = True
        
        for content_type in content_types:
            try:
                response = self.session.get(f"{API_BASE}/content/{content_type}")
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data is None:
                        self.log_test(f"Content {content_type}", False, "Returned null data")
                        all_passed = False
                    elif isinstance(data, list) and len(data) == 0:
                        self.log_test(f"Content {content_type}", False, "Returned empty array")
                        all_passed = False
                    elif isinstance(data, dict) and len(data) == 0:
                        self.log_test(f"Content {content_type}", False, "Returned empty object")
                        all_passed = False
                    else:
                        # Check specific content structure
                        if content_type == 'tarot' and isinstance(data, list):
                            # Check tarot card structure
                            if len(data) > 0 and 'name' in data[0] and 'upright' in data[0]:
                                self.log_test(f"Content {content_type}", True, f"Loaded {len(data)} tarot cards")
                            else:
                                self.log_test(f"Content {content_type}", False, "Invalid tarot card structure")
                                all_passed = False
                        elif content_type == 'spreads' and isinstance(data, dict):
                            # Check spreads structure
                            spread_count = len(data)
                            if spread_count > 0:
                                self.log_test(f"Content {content_type}", True, f"Loaded {spread_count} spreads")
                            else:
                                self.log_test(f"Content {content_type}", False, "No spreads found")
                                all_passed = False
                        else:
                            self.log_test(f"Content {content_type}", True, f"Content loaded successfully")
                else:
                    self.log_test(f"Content {content_type}", False, f"HTTP {response.status_code}", response.text)
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Content {content_type}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_checkout_flow(self):
        """Test order creation and checkout flow"""
        try:
            # First get spreads to use a valid spread_id
            spreads_response = self.session.get(f"{API_BASE}/content/spreads")
            if spreads_response.status_code != 200:
                self.log_test("Checkout Flow", False, "Cannot get spreads for testing")
                return False
            
            spreads = spreads_response.json()
            if not spreads:
                self.log_test("Checkout Flow", False, "No spreads available for testing")
                return False
            
            # Use first available spread
            spread_id = list(spreads.keys())[0]
            
            # Test order creation
            order_data = {
                "email": "test@pleyazul.com",
                "spread_id": spread_id,
                "custom_question": "Test question for oracle reading"
            }
            
            response = self.session.post(f"{API_BASE}/checkout", json=order_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields in response
                required_fields = ['success', 'order_id']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Checkout Flow", False, f"Missing response fields: {missing_fields}", data)
                    return False
                
                if not data.get('success'):
                    self.log_test("Checkout Flow", False, "Order creation failed", data)
                    return False
                
                order_id = data.get('order_id')
                
                # Check if test mode is working
                if data.get('test_mode'):
                    self.log_test("Checkout Flow", True, f"Order created in test mode: {order_id}", data)
                    
                    # Test mock payment
                    mock_payment_data = {"order_id": order_id}
                    mock_response = self.session.post(f"{API_BASE}/paypal/mock-payment", json=mock_payment_data)
                    
                    if mock_response.status_code == 200:
                        mock_data = mock_response.json()
                        if mock_data.get('success'):
                            self.log_test("Mock Payment", True, "Mock payment completed successfully", mock_data)
                            return order_id  # Return order_id for further testing
                        else:
                            self.log_test("Mock Payment", False, "Mock payment failed", mock_data)
                            return False
                    else:
                        self.log_test("Mock Payment", False, f"HTTP {mock_response.status_code}", mock_response.text)
                        return False
                else:
                    # PayPal integration test
                    if 'paypal_order' in data:
                        self.log_test("Checkout Flow", True, f"PayPal order created: {order_id}", data)
                        return order_id
                    else:
                        self.log_test("Checkout Flow", False, "No PayPal order or test mode", data)
                        return False
            else:
                self.log_test("Checkout Flow", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Checkout Flow", False, f"Error: {str(e)}")
            return False
    
    def test_reading_generation(self, order_id=None):
        """Test reading generation for different oracle types"""
        if not order_id:
            # Create a test order first
            order_id = self.test_checkout_flow()
            if not order_id:
                self.log_test("Reading Generation", False, "Cannot create test order")
                return False
        
        try:
            # Test reading generation
            reading_data = {"order_id": order_id}
            response = self.session.post(f"{API_BASE}/readings/generate", json=reading_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('success'):
                    reading = data.get('reading', {})
                    result_json = reading.get('result_json', {})
                    
                    # Check reading structure
                    if 'type' in result_json and 'timestamp' in result_json:
                        oracle_type = result_json['type']
                        
                        # Validate specific oracle types
                        if oracle_type == 'tarot':
                            if 'cards' in result_json and len(result_json['cards']) > 0:
                                self.log_test("Reading Generation", True, f"Tarot reading generated with {len(result_json['cards'])} cards")
                            else:
                                self.log_test("Reading Generation", False, "Tarot reading missing cards")
                                return False
                        elif oracle_type == 'iching':
                            if 'hexagram' in result_json:
                                self.log_test("Reading Generation", True, f"I Ching reading generated: {result_json['hexagram'].get('nombre', 'Unknown')}")
                            else:
                                self.log_test("Reading Generation", False, "I Ching reading missing hexagram")
                                return False
                        elif oracle_type == 'rueda':
                            if 'animals' in result_json and len(result_json['animals']) > 0:
                                self.log_test("Reading Generation", True, f"Rueda reading generated with {len(result_json['animals'])} animals")
                            else:
                                self.log_test("Reading Generation", False, "Rueda reading missing animals")
                                return False
                        else:
                            self.log_test("Reading Generation", False, f"Unknown oracle type: {oracle_type}")
                            return False
                        
                        return True
                    else:
                        self.log_test("Reading Generation", False, "Invalid reading structure", result_json)
                        return False
                else:
                    self.log_test("Reading Generation", False, "Reading generation failed", data)
                    return False
            else:
                self.log_test("Reading Generation", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Reading Generation", False, f"Error: {str(e)}")
            return False
    
    def test_database_operations(self, order_id=None):
        """Test database operations - orders and readings"""
        try:
            # Test orders endpoint
            response = self.session.get(f"{API_BASE}/orders")
            
            if response.status_code == 200:
                orders = response.json()
                
                if isinstance(orders, list):
                    self.log_test("Database Orders", True, f"Retrieved {len(orders)} orders from database")
                    
                    # If we have an order_id, test specific order retrieval
                    if order_id:
                        order_response = self.session.get(f"{API_BASE}/orders/{order_id}")
                        
                        if order_response.status_code == 200:
                            order_data = order_response.json()
                            
                            if 'order' in order_data:
                                self.log_test("Database Single Order", True, f"Retrieved specific order: {order_id}")
                                
                                # Test reading retrieval
                                if 'reading' in order_data and order_data['reading']:
                                    self.log_test("Database Reading", True, "Reading found in database")
                                    return True
                                else:
                                    # Try direct reading endpoint
                                    reading_response = self.session.get(f"{API_BASE}/readings/{order_id}")
                                    
                                    if reading_response.status_code == 200:
                                        self.log_test("Database Reading", True, "Reading retrieved from direct endpoint")
                                        return True
                                    else:
                                        self.log_test("Database Reading", False, f"Reading not found: HTTP {reading_response.status_code}")
                                        return False
                            else:
                                self.log_test("Database Single Order", False, "Order data malformed", order_data)
                                return False
                        else:
                            self.log_test("Database Single Order", False, f"HTTP {order_response.status_code}", order_response.text)
                            return False
                    else:
                        return True
                else:
                    self.log_test("Database Orders", False, "Orders response is not an array", orders)
                    return False
            else:
                self.log_test("Database Orders", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Database Operations", False, f"Error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error scenarios and edge cases"""
        all_passed = True
        
        # Test invalid spread ID
        try:
            invalid_order = {
                "email": "test@pleyazul.com",
                "spread_id": "invalid_spread_id_12345"
            }
            
            response = self.session.post(f"{API_BASE}/checkout", json=invalid_order)
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    self.log_test("Error Handling - Invalid Spread", True, "Correctly rejected invalid spread ID")
                else:
                    self.log_test("Error Handling - Invalid Spread", False, "Error response missing error field", data)
                    all_passed = False
            else:
                self.log_test("Error Handling - Invalid Spread", False, f"Expected 400, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Spread", False, f"Error: {str(e)}")
            all_passed = False
        
        # Test missing required fields
        try:
            incomplete_order = {"email": "test@pleyazul.com"}  # Missing spread_id
            
            response = self.session.post(f"{API_BASE}/checkout", json=incomplete_order)
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    self.log_test("Error Handling - Missing Fields", True, "Correctly rejected incomplete order")
                else:
                    self.log_test("Error Handling - Missing Fields", False, "Error response missing error field", data)
                    all_passed = False
            else:
                self.log_test("Error Handling - Missing Fields", False, f"Expected 400, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            self.log_test("Error Handling - Missing Fields", False, f"Error: {str(e)}")
            all_passed = False
        
        # Test non-existent order
        try:
            fake_order_id = "non_existent_order_12345"
            response = self.session.get(f"{API_BASE}/orders/{fake_order_id}")
            
            if response.status_code == 404:
                self.log_test("Error Handling - Non-existent Order", True, "Correctly returned 404 for non-existent order")
            else:
                self.log_test("Error Handling - Non-existent Order", False, f"Expected 404, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            self.log_test("Error Handling - Non-existent Order", False, f"Error: {str(e)}")
            all_passed = False
        
        return all_passed
    
    def test_admin_endpoints(self):
        """Test admin functionality"""
        try:
            response = self.session.get(f"{API_BASE}/admin/setup-status")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ['paypal_configured', 'telegram_configured', 'test_mode', 'admin_password_set']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Admin Setup Status", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Check webhooks
                if 'webhooks' in data:
                    webhooks = data['webhooks']
                    if 'paypal_url' in webhooks and 'telegram_url' in webhooks:
                        self.log_test("Admin Setup Status", True, "Admin setup status retrieved successfully", data)
                        return True
                    else:
                        self.log_test("Admin Setup Status", False, "Webhook URLs missing", data)
                        return False
                else:
                    self.log_test("Admin Setup Status", False, "Webhooks section missing", data)
                    return False
            else:
                self.log_test("Admin Setup Status", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Admin Setup Status", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("🔮 Starting Pleyazul Oráculos Backend Test Suite")
        print("=" * 60)
        
        # Test 1: API Status
        print("\n1. Testing API Status and Health Check...")
        api_status = self.test_api_status()
        
        # Test 2: Content Loading
        print("\n2. Testing Content Loading Endpoints...")
        content_status = self.test_content_endpoints()
        
        # Test 3: Checkout Flow
        print("\n3. Testing Order Creation and Checkout Flow...")
        order_id = self.test_checkout_flow()
        
        # Test 4: Reading Generation
        print("\n4. Testing Reading Generation...")
        reading_status = self.test_reading_generation(order_id if order_id else None)
        
        # Test 5: Database Operations
        print("\n5. Testing Database Operations...")
        db_status = self.test_database_operations(order_id if order_id else None)
        
        # Test 6: Error Handling
        print("\n6. Testing Error Handling...")
        error_status = self.test_error_handling()
        
        # Test 7: Admin Endpoints
        print("\n7. Testing Admin Endpoints...")
        admin_status = self.test_admin_endpoints()
        
        # Summary
        print("\n" + "=" * 60)
        print("🔮 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Show failed tests
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        # Overall status
        critical_systems = [api_status, content_status, bool(order_id), reading_status]
        if all(critical_systems):
            print("\n🎉 CORE FUNCTIONALITY: WORKING")
            return True
        else:
            print("\n⚠️  CORE FUNCTIONALITY: ISSUES DETECTED")
            return False

if __name__ == "__main__":
    tester = PleyazulBackendTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_detailed.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_results_detailed.json")
    
    exit(0 if success else 1)