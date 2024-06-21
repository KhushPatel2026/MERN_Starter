import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/verify-token', {
          headers: {
            'x-access-token': token
          }
        });
        const data = await response.json();

        if (data.status !== 'ok') {
          alert(data.error);
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const profileResponse = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'x-access-token': token
          }
        });
        const profileData = await profileResponse.json();

        if (profileData.status === 'ok') {
          setProfile(profileData.profile);
        } else {
          alert(profileData.error);
          localStorage.removeItem('token');
          navigate('/login');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error verifying token or fetching profile:', error);
        alert('An error occurred. Please try again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = e.target;

    try {
      const response = await fetch('http://localhost:3000/api/profile/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value
        })
      });

      const data = await response.json();
      if (data.status === 'ok') {
        alert('Profile updated successfully');
        window.location.reload();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {profile && (
        <div id="profile">
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
      <form id="edit-profile-form" onSubmit={handleEditProfile}>
        <input type="text" name="name" placeholder="Name" defaultValue={profile?.name} required />
        <input type="email" name="email" placeholder="Email" defaultValue={profile?.email} required />
        <input type="password" name="password" placeholder="New Password" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
