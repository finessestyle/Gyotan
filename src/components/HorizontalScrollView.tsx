import { ScrollView, StyleSheet, Text, View } from 'react-native'

const HorizontalScrollView: React.FC = () => {
  return (
      <View style={styles.container}>
          <View style={styles.section}>
              <Text style={styles.header}>First</Text>
              <ScrollView horizontal style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                  {Array.from({ length: 20 }, (_, index) => (
                      <View key={index} style={styles.item}>
                          <Text style={styles.text}>Item {index + 1}</Text>
                      </View>
                  ))}
              </ScrollView>
          </View>
          <View style={styles.section}>
              <Text style={styles.header}>Second</Text>
              <ScrollView horizontal style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                  {Array.from({ length: 20 }, (_, index) => (
                      <View key={index} style={styles.item2}>
                          <Text style={styles.text}>Item {index + 1}</Text>
                      </View>
                  ))}
              </ScrollView>
          </View>
          <View style={styles.section}>
              <Text style={styles.header}>Third</Text>
              <ScrollView horizontal style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                  {Array.from({ length: 20 }, (_, index) => (
                      <View key={index} style={styles.item3}>
                          <Text style={styles.text}>Item {index + 1}</Text>
                      </View>
                  ))}
              </ScrollView>
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20
  },
  section: {
    marginHorizontal: 15
  },
  header: {
    color: '#1c1c1e',
    fontSize: 24,
    marginBottom: 10
  },
  scrollView: {
    marginBottom: 20
  },
  contentContainer: {
    flexDirection: 'row'
  },
  item: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0077b3',
    marginVertical: 10,
    marginRight: 15
  },
  item2: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    marginVertical: 10,
    marginRight: 15,
    borderRadius: 10
  },
  item3: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    marginVertical: 10,
    marginRight: 15,
    borderRadius: 5
  },
  text: {
    color: '#fff',
    fontSize: 20
  }
})

export default HorizontalScrollView
