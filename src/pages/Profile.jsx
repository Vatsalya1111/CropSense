import { User, MapPin, Sprout } from "lucide-react";
import { farmData } from "../data/mockData";

function Profile() {
  return (
    <div className="simple-page">
      <p className="eyebrow">FARMER ACCOUNT</p>

      <h1>My Profile</h1>

      <p className="page-subtitle">
        Your farmer and farm information.
      </p>

      <div className="profile-card">
        <div className="profile-large-avatar">
          <User size={30} />
        </div>

        <div>
          <h2>{farmData.farmerName}</h2>
          <p>Farmer account</p>
        </div>
      </div>

      <div className="profile-details">
        <div>
          <MapPin size={19} />
          <span>Location</span>
          <strong>{farmData.location}</strong>
        </div>

        <div>
          <Sprout size={19} />
          <span>Crop</span>
          <strong>{farmData.crop}</strong>
        </div>
      </div>
    </div>
  );
}

export default Profile;