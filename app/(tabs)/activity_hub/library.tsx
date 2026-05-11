import BottomNav from '@/components/bottom-nav';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function CombinedProtocolsView() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION 1: SEARCH & FILTERS --- */}
        <View style={styles.headerSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#9a9080" style={styles.searchIcon} />
            <TextInput 
              placeholder="Find your rhythm..." 
              placeholderTextColor="#9a9080"
              style={styles.searchInput}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterContainer}
          >
            <FilterBtn label="All" active />
            <FilterBtn label="Strength" />
            <FilterBtn label="Cardio" />
            <FilterBtn label="Mobility" />
          </ScrollView>
        </View>

        {/* --- SECTION 2: FEATURED CARD (Ethereal Flow) --- */}
        <View style={styles.featuredContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=800&q=80' }}
            style={styles.featuredCard}
            imageStyle={{ borderRadius: 32 }}
          >
            <View style={styles.featuredOverlay}>
              <View style={styles.durationTag}>
                <Feather name="clock" size={14} color="#FDF9F3" />
                <Text style={styles.durationText}>24 MIN</Text>
              </View>
              
              <Text style={styles.featuredTitle}>Ethereal Flow</Text>
              <Text style={styles.featuredDesc}>
                A mindful transition through restorative postures designed to ground your morning.
              </Text>

              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color="#FDF9F3" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* --- SECTION 3: DAILY PROTOCOLS --- */}
        <View style={styles.protocolsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Protocols</Text>
            <TouchableOpacity>
              <Text style={styles.viewArchive}>VIEW ARCHIVE</Text>
            </TouchableOpacity>
          </View>

          <ProtocolItem 
            image="https://images.unsplash.com/photo-1583454110551-21f2fa2ae617?auto=format&fit=crop&w=200&q=80"
            title="Upper Body Sculpt"
            subtitle="Functional resistance • 18 min"
          />
          <ProtocolItem 
            image="https://images.unsplash.com/photo-1518611012118-29a7d63d0c24?auto=format&fit=crop&w=200&q=80"
            title="Core Stability"
            subtitle="Alignment focus • 12 min"
          />
        </View>

        {/* --- SECTION 4: PERSONALIZED REHAB --- */}
        <TouchableOpacity style={styles.rehabCard}>
          <View style={styles.rehabContent}>
            <View style={styles.rehabTag}>
              <Text style={styles.rehabTagText}>PRIORITY CARE</Text>
            </View>
            <Text style={styles.rehabTitle}>Personalized Rehab</Text>
            <Text style={styles.rehabDesc}>
              Tailored recovery sequences based on your recent movement patterns.
            </Text>
          </View>
          <Feather name="arrow-up-right" size={28} color="rgba(253, 249, 243, 0.6)" />
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation */}
       <BottomNav/>
    </SafeAreaView>
  );
}

const FilterBtn = ({ label, active }) => (
  <TouchableOpacity style={[styles.filterBtn, active && styles.filterBtnActive]}>
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const ProtocolItem = ({ image, title, subtitle }) => (
  <TouchableOpacity style={styles.protocolCard}>
    <Image source={{ uri: image }} style={styles.protocolImg} />
    <View style={styles.protocolInfo}>
      <Text style={styles.protocolTitle}>{title}</Text>
      <Text style={styles.protocolSubtitle}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#9a9080" />
  </TouchableOpacity>
);

const NavItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      <Feather name={icon} size={20} color={active ? "#FDF9F3" : "#9a9080"} />
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9F3",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2EBEB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#39382F',
    fontFamily: 'serif',
  },
  filterContainer: {
    gap: 12,
  },
  filterBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F2EBEB',
  },
  filterBtnActive: {
    backgroundColor: '#526148',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#39382F',
  },
  filterTextActive: {
    color: '#FDF9F3',
  },
  featuredContainer: {
    marginBottom: 40,
  },
  featuredCard: {
    height: 480,
    width: '100%',
    overflow: 'hidden',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 32,
    justifyContent: 'flex-end',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 56, 47, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  durationText: {
    color: '#FDF9F3',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FDF9F3',
    marginBottom: 12,
  },
  featuredDesc: {
    fontSize: 16,
    color: 'rgba(253, 249, 243, 0.8)',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: '85%',
  },
  playButton: {
    position: 'absolute',
    right: 32,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A8B79B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  protocolsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  viewArchive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9a9080',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#39382F',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  protocolImg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F5F2EB',
  },
  protocolInfo: {
    flex: 1,
    marginLeft: 16,
  },
  protocolTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 4,
  },
  protocolSubtitle: {
    fontSize: 13,
    color: '#9a9080',
  },
  rehabCard: {
    backgroundColor: '#526148',
    borderRadius: 32,
    padding: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rehabContent: {
    flex: 1,
    marginRight: 16,
  },
  rehabTag: {
    backgroundColor: 'rgba(253, 249, 243, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  rehabTagText: {
    color: '#FDF9F3',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  rehabTitle: {
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FDF9F3',
    marginBottom: 12,
  },
  rehabDesc: {
    fontSize: 14,
    color: 'rgba(253, 249, 243, 0.7)',
    lineHeight: 22,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF9F3',
    paddingBottom: 30,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(57, 56, 47, 0.05)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: '#A8B79B',
  },
  navText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9a9080',
  },
  navTextActive: {
    color: '#39382F',
  },
});
