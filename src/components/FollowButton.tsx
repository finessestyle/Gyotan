import { Button } from 'react-native'
import { useState, useEffect } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, DocumentSnapshot } from 'firebase/firestore'
import { db } from '../config'
import { type User } from '../../types/user'

// Firestoreからユーザードキュメントを取得する関数
const getUserDoc = async (userId: string): Promise<DocumentSnapshot | undefined> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap
    } else {
      console.error('ユーザードキュメントが見つかりません:', userId)
    }
  } catch (error) {
    console.error('ユーザードキュメントの取得中にエラーが発生しました:', error)
  }
}

// フォローする関数
const followUser = async (currentUser: User, targetUser: User): Promise<void> => {
  try {
    const currentUserRef = doc(db, 'users', currentUser.id)
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUser.id)
    })

    const targetUserRef = doc(db, 'users', targetUser.id)
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUser.id)
    })

    console.log('フォローしました:', currentUser.userName, '->', targetUser.userName)
  } catch (error) {
    console.error('フォローに失敗しました:', error)
  }
}

// アンフォローする関数
const unfollowUser = async (currentUser: User, targetUser: User): Promise<void> => {
  try {
    const currentUserRef = doc(db, 'users', currentUser.id)
    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUser.id)
    })

    const targetUserRef = doc(db, 'users', targetUser.id)
    await updateDoc(targetUserRef, {
      followers: arrayRemove(currentUser.id)
    })

    console.log('フォロー解除しました:', currentUser.userName, '->', targetUser.userName)
  } catch (error) {
    console.error('フォロー解除に失敗しました:', error)
  }
}

// フォローボタンコンポーネント
interface FollowButtonProps {
  currentUser: User
  targetUser: User
}

const FollowButton = ({ currentUser, targetUser }: FollowButtonProps): JSX.Element => {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const checkIfFollowing = async (): Promise<void> => {
      try {
        const userDoc = await getUserDoc(currentUser.id)
        if (userDoc?.data()?.following?.includes(targetUser.id)) {
          setIsFollowing(true)
        } else {
          setIsFollowing(false)
        }
      } catch (error) {
        console.error('フォロー状態の確認中にエラーが発生しました:', error)
      }
    }
    checkIfFollowing()
  }, [currentUser, targetUser])

  const handleFollow = async (): Promise<void> => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUser, targetUser)
        setIsFollowing(false)
      } else {
        await followUser(currentUser, targetUser)
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('フォローボタン処理中にエラーが発生しました:', error)
    }
  }

  return (
    <Button
      title={isFollowing ? 'Unfollow' : 'Follow'}
      onPress={handleFollow}
    />
  )
}

export default FollowButton
