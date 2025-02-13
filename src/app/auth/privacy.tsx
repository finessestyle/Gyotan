import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native'

const Privacy = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>プライバシーポリシー</Text>
        <Text style={styles.text}>
          当アプリは、アプリ上で提供するサービスにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
        </Text>
        <Text style={styles.sectionTitle}>第1条（個人情報）</Text>
        <Text style={styles.text}>
          「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、
          当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。
        </Text>
        <Text style={styles.sectionTitle}>第2条（個人情報の収集）</Text>
        <Text style={styles.text}>
          当アプリは、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレスなどの個人情報をお尋ねすることがあります。
        </Text>

        <Text style={styles.sectionTitle}>第3条（個人情報を収集・利用する目的）</Text>
        <Text style={styles.text}>
          当アプリが個人情報を収集・利用する目的は、以下のとおりです。
        </Text>
        <Text style={styles.bulletPoint}>・サービスの提供・運営のため</Text>
        <Text style={styles.bulletPoint}>・ユーザーからのお問い合わせに回答するため（本人確認を含む）</Text>
        <Text style={styles.bulletPoint}>・メンテナンス、重要なお知らせなどのご連絡のため</Text>

        <Text style={styles.sectionTitle}>第4条（利用目的の変更）</Text>
        <Text style={styles.text}>
          当アプリは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更できます。
        </Text>

        <Text style={styles.sectionTitle}>（お問い合わせ窓口）</Text>
        <Text style={styles.text}>
          本プライバシーポリシーに関するお問い合わせは、
        <Text
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL('https://forms.gle/2apUPegk4WrNiMUv5')}
        >
          こちらのフォーム
        </Text>
          までお願いいたします。
        </Text>
        <Text style={styles.contact}>当アプリ管理者：フィネススタイル</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  text: {
    fontSize: 14,
    lineHeight: 22
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 10
  },
  contact: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10
  }
})

export default Privacy
