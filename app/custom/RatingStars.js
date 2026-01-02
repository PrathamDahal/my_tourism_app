import { View, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RatingStars = ({ rating }) => {
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesome key={i} name="star" style={styles.star} />);
      } else if (i < Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FontAwesome key={i} name="star-half-empty" style={styles.star} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" style={styles.star} />);
      }
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center', // center by default; change if needed
  },
  star: {
    color: '#facc15', // tailwind yellow-500
    fontSize: 12,
    marginHorizontal: 1,
  },
});

export default RatingStars;
