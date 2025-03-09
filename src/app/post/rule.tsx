import { View, Text, ScrollView, StyleSheet } from 'react-native'

const Rule = (): JSX.Element => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>琵琶湖バス釣りルール</Text>

        <Text style={styles.subtitle}>外来生物法の理解と遵守について</Text>
        <Text style={styles.text}>2005年6月1日、国によって外来生物法（特定外来生物による生態系等に係る被害の防止に関する法律）が施行され、ブラックバスと呼ばれるオオクチバス（フロリダバスを含む）、コクチバスが対象魚として指定されました。</Text>
        <Text style={styles.text}>しかし、この法律ではバス釣りそのものとキャッチ&リリースは禁止されていません。</Text>
        <Text style={styles.text}>つまり、普通にバス釣りをするのは問題はないのです。</Text>
        <Text style={styles.text}>ただし、この外来生物法によって、特定外来生物に指定された生物を「飼うこと」「運搬すること」「売り買いすること」「人にあげたり、もらったりすること」「野外に放つこと」「輸入すること」が禁止されています。そのため、ブラックバスの移植放流は禁止されています。</Text>

        <Text style={styles.subtitle}>外来魚のリリース禁止</Text>
        <Text style={styles.text}>滋賀県全域で、釣り上げたブラックバスやブルーギルはリリース（再放流）が禁止されています。</Text>
        <Text style={styles.text}>湖岸の釣りスポットとなっている公園などに外来魚回収ボックスや回収いけすが設置されています。</Text>

        <Text style={styles.subtitle}>最低限のマナーとしてゴミは捨てない</Text>
        <Text style={styles.text}>釣り糸やワーム、使用済みパッケージ、食べ物や飲み物のゴミなどをフィールドに捨てるのは禁止です。</Text>
        <Text style={styles.text}>喫煙者は携帯灰皿を利用し、吸い殻のポイ捨てをやめましょう。</Text>
        <Text style={styles.text}>バスアングラーの最低限のマナーとしてゴミは持ち帰りましょう。</Text>

        <Text style={styles.subtitle}>駐車禁止の場所には車を止めない</Text>
        <Text style={styles.text}>琵琶湖には住宅近くのポイントもあります、駐車禁止の場所には車を止めないようにしましょう。</Text>
        <Text style={styles.text}>違法駐車が原因で立ち入り禁止になったポイントもあります。</Text>

        <Text style={styles.subtitle}>迷惑行為は絶対に慎みましょう</Text>
        <Text style={styles.text}>立ち入り禁止エリアでは釣りをしない。</Text>
        <Text style={styles.text}>立ち入り禁止の漁港やエリア、河川の禁漁区など、釣りをしてはいけない場所への侵入は禁止です。</Text>
        <Text style={styles.text}>立ち入り禁止ポイントに設置されているフェンスを破っての侵入行為などは、マナー以前の問題ですので、絶対にやめましょう。</Text>

        <Text style={styles.subtitle}>他のアングラーとトラブルを起こさない</Text>
        <Text style={styles.text}>釣り場はあなた一人のものではありません。他の魚種を釣っている人もいます。</Text>
        <Text style={styles.text}>釣り場では他の釣り人とトラブルを起こさないようにしましょう。</Text>
        <Text style={styles.text}>無意識にでも他の人の邪魔をした場合には、素直に謝ることも大切です。</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16
  },
  text: {
    fontSize: 16,
    lineHeight: 24
  }
})

export default Rule
