import { useEffect, useState } from 'react'
import {
    doc, getDoc, setDoc, deleteDoc
} from 'firebase/firestore'
import {
    auth, db
} from '../firebaseConfig'
import {
    EmailAuthProvider, reauthenticateWithCredential, deleteUser
} from 'firebase/auth'

const Profile = () => {
    const [profile, setProfile] = useState<{ name: string; address: string }>({
        name: '',
        address: '',
    })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Fetch user profile from Firestore
    useEffect(() => {
        const fetchProfile = async () => {
            const currentUser = auth.currentUser
            if (!currentUser) {
                setMessage('No authenticated user found.')
                setLoading(false)
                return
            }

            try {
                const userDocRef = doc(db, 'users', currentUser.uid)
                const userDocSnap = await getDoc(userDocRef)

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data()
                    setProfile({
                        name: userData.name || '',
                        address: userData.address || '',
                    })
                } else {
                    setMessage('No profile data found.')
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error)
                setMessage('Failed to fetch profile.')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        setMessage('')
        const currentUser = auth.currentUser
        if (!currentUser) {
            setMessage('No authenticated user found.')
            return
        }

        try {
            const userDocRef = doc(db, 'users', currentUser.uid)
            await setDoc(
                userDocRef,
                {
                    name: profile.name,
                    address: profile.address,
                },
                { merge: true }
            )
            setMessage('Profile updated successfully.')
        } catch (error) {
            console.error('Failed to update profile:', error)
            setMessage('Failed to update profile.')
        }
    }

    const handleDelete = async () => {
        setMessage('')
        const currentUser = auth.currentUser
        if (!currentUser) {
            setMessage('No authenticated user found.')
            return
        }
        if (!confirmPassword) {
            setMessage('Please enter your password to confirm deletion.')
            return
        }

        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email!,
                confirmPassword
            )
            await reauthenticateWithCredential(currentUser, credential)

            // Delete Firestore user document
            await deleteDoc(doc(db, 'users', currentUser.uid))

            // Delete Firebase auth user
            await deleteUser(currentUser)

            setMessage('Account deleted successfully.')
            // Optionally: redirect or sign out user here
        } catch (err: any) {
            console.error('Failed to delete account:', err)
            setMessage(`Failed to delete account: ${err.message}`)
        }
    }

    if (loading) return <div className="text-center mt-5">Loading profile...</div>

    return (
        <div className="container my-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center">User Profile</h2>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={auth.currentUser?.email || ''}
                    disabled
                />
            </div>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="address" className="form-label">
                    Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    rows={3}
                />
            </div>

            <button className="btn btn-primary me-2" onClick={handleUpdate}>
                Update Profile
            </button>

            <hr className="my-4" />

            <h4 className="mb-3 text-danger">Delete Account</h4>

            <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password (required)
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password to confirm"
                />
            </div>

            <button className="btn btn-danger" onClick={handleDelete}>
                Delete Account
            </button>

            {message && (
                <div
                    className={`alert mt-4 ${message.includes('success') ? 'alert-success' : 'alert-danger'
                        }`}
                    role="alert"
                >
                    {message}
                </div>
            )}
        </div>
    )
}

export default Profile