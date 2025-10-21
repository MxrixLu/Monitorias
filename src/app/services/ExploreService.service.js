import { db } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

export async function getMajor() {
    const snapshot = await getDocs(collection(db, 'major'))
    return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        name: docSnap.data().name,
    }))
}