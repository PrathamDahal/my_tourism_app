import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RatingStars from './../../../custom/RatingStars';

const CustomerFeedback = ({ feedback }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {feedback.map((item, index) => (
          <View key={index.toString()} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
                <RatingStars rating={item.reviews} />
                <Text style={styles.comment}>{item.comment}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default CustomerFeedback;
