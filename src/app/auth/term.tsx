import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Button from '../../components/Button'

const handleAgree = (): void => {
  router.replace('/auth/signup?termsAgreed=true')
}

const TermsOfService = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Gyotanアプリ 利用規約</Text>

        <Text style={styles.sectionTitle}>第1条（適用）</Text>
        <Text style={styles.text}>
          本規約は、ユーザーと本アプリ運営者（以下、「運営者」といいます。）との間の本アプリの利用に関わる一切の関係に適用されます。
        </Text>

        <Text style={styles.sectionTitle}>第2条（利用登録）</Text>
        <Text style={styles.text}>
          本アプリの利用に際し、ユーザーは本規約に同意の上、必要な登録手続きを行うものとします。運営者は、以下のいずれかに該当する場合、利用登録を承認しないことがあります。
        </Text>
        <Text style={styles.bulletPoint}>・虚偽の情報を提供した場合</Text>
        <Text style={styles.bulletPoint}>・過去に本規約違反等により利用制限を受けたことがある場合</Text>
        <Text style={styles.bulletPoint}>・その他、運営者が不適当と判断した場合</Text>

        <Text style={styles.sectionTitle}>第3条（アカウント管理）</Text>
        <Text style={styles.text}>
          ユーザーは、自己の責任においてアカウント情報（メールアドレス、パスワード等）を適切に管理するものとします。
        </Text>
        <Text style={styles.text}>
          ユーザーのアカウントを第三者に譲渡・貸与することは禁止します。
        </Text>

        <Text style={styles.sectionTitle}>第4条（利用料金）</Text>
        <Text style={styles.text}>
          本アプリは基本無料で利用できますが、一部有料サービスが含まれる場合があります。有料サービスを利用する場合、運営者が定めた方法で支払いを行うものとします。
        </Text>

        <Text style={styles.sectionTitle}>第5条（禁止事項）</Text>
        <Text style={styles.text}>ユーザーは、本アプリの利用に際し、以下の行為をしてはなりません。</Text>
        <Text style={styles.bulletPoint}>・法令または公序良俗に違反する行為</Text>
        <Text style={styles.bulletPoint}>・他のユーザーの個人情報を不正に収集する行為</Text>
        <Text style={styles.bulletPoint}>・不正アクセスまたはそれを試みる行為</Text>
        <Text style={styles.bulletPoint}>・他人になりすます行為</Text>
        <Text style={styles.bulletPoint}>・著作権、肖像権、プライバシー権を侵害する行為</Text>
        <Text style={styles.bulletPoint}>・運営者の許可なく営業活動・宣伝を行う行為</Text>
        <Text style={styles.bulletPoint}>・その他、運営者が不適切と判断する行為</Text>

        <Text style={styles.sectionTitle}>第6条（投稿・位置情報の取り扱い）</Text>
        <Text style={styles.text}>
          ユーザーが投稿した釣果情報（写真、位置情報、コメント等）は、運営者が本アプリのサービス向上のために利用できるものとします。
        </Text>
        <Text style={styles.text}>
          ユーザーが投稿するコンテンツは、著作権等の権利を有するもの、または適切な許諾を得たものに限ります。
        </Text>
        <Text style={styles.text}>
          本アプリは位置情報を利用します。ユーザーは、アプリの設定により位置情報の取得を許可または拒否できます。
        </Text>

        <Text style={styles.sectionTitle}>第7条（免責事項）</Text>
        <Text style={styles.text}>
          運営者は、本アプリの安全性、完全性、正確性について保証しません。
        </Text>
        <Text style={styles.text}>
          本アプリの利用により生じた損害について、運営者は一切の責任を負いません。
        </Text>
        <Text style={styles.text}>
          ユーザー間または第三者とのトラブルに関して、運営者は関与せず、一切の責任を負いません。
        </Text>

        <Text style={styles.sectionTitle}>第8条（利用制限・登録抹消）</Text>
        <Text style={styles.text}>
          運営者は、ユーザーが以下のいずれかに該当すると判断した場合、事前の通知なく本アプリの利用を制限またはアカウントを抹消できるものとします。
        </Text>
        <Text style={styles.bulletPoint}>・本規約に違反した場合</Text>
        <Text style={styles.bulletPoint}>・虚偽の情報を登録した場合</Text>
        <Text style={styles.bulletPoint}>・運営者の業務を妨害した場合</Text>
        <Text style={styles.bulletPoint}>・その他、運営者が利用継続を不適当と判断した場合</Text>

        <Text style={styles.sectionTitle}>第9条（規約の変更）</Text>
        <Text style={styles.text}>
          運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本アプリ内に掲載された時点で効力を生じます。
        </Text>

        <Text style={styles.sectionTitle}>第10条（準拠法・裁判管轄）</Text>
        <Text style={styles.text}>
          本規約の解釈には日本法を準拠法とし、本アプリに関する紛争は、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
        </Text>
        <Button
          label={'同意する'}
          buttonStyle={{ width: '100%', alignItems: 'center', marginVertical: 16 }}
          labelStyle={{ fontSize: 20 }}
          onPress={handleAgree}
        />
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

export default TermsOfService
