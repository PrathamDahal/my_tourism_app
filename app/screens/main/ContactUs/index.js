import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Image,
  Linking 
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const ContactUs = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Get in Touch</Text>
        <Text style={styles.subHeaderText}>
          Have questions about your trip to Panch Pokhari or need assistance with
          bookings? We're here to help!
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Contact Information Section */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactHeader}>Contact Information</Text>
          <Text style={styles.contactSubHeader}>Say something to get help!</Text>

          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => Linking.openURL('tel:+977-1-23456789')}
          >
            <MaterialIcons name="call" size={24} color="white" />
            <Text style={styles.contactText}>+977-1-23456789</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => Linking.openURL('mailto:support@panchpokhari.com')}
          >
            <MaterialIcons name="email" size={24} color="white" />
            <Text style={styles.contactText}>support@panchpokhari.com</Text>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <FontAwesome name="map-marker" size={24} color="white" />
            <Text style={styles.contactText}>
              132 Dartmouth Street Boston, Massachusetts 02156 United States
            </Text>
          </View>

          {/* Decorative images - you'll need to replace these with your actual image imports */}
          <Image
            source={require('../../../../assets/Images/Contact/Ellipse 793.png')}
            style={styles.decorativeImage1}
          />
          <Image
            source={require('../../../../assets/Images/Contact/Ellipse 794.png')}
            style={styles.decorativeImage2}
          />
        </View>

        {/* Contact Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.nameInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.contactInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 212 3456 789"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Write your message..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '40',    
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'OpenSans_400Regular',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  contactInfo: {
    backgroundColor: '#991b1b',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  contactHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold',
  },
  contactSubHeader: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 24,
    fontFamily: 'OpenSans_400Regular',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 16,
    flex: 1,
    fontFamily: 'OpenSans_400Regular',
  },
  decorativeImage1: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 100,
    height: 60,
  },
  decorativeImage2: {
    position: 'absolute',
    bottom: 0,
    right: 40,
    width: 80,
    height: 60,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  nameInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contactInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
    paddingBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'OpenSans_400Regular',
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
    fontFamily: 'OpenSans_400Regular',
  },
  messageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
    marginBottom: 24,
  },
  messageInput: {
    fontSize: 16,
    color: '#000',
    height: 80,
    textAlignVertical: 'top',
    fontFamily: 'OpenSans_400Regular',
  },
  submitButton: {
    backgroundColor: '#991b1b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
});

export default ContactUs;