import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/MenuOptionPages.css";

export default function AccountSettings() {
  const navigate = useNavigate();
  const stored = (() => { try { return JSON.parse(localStorage.getItem('userProfile')||'{}'); } catch { return {}; } })();
  const [email, setEmail] = useState(stored.email || "");
  const [phone, setPhone] = useState(stored.phone || "");
  const handleVerify = (field) => {
    const otp = prompt(`Enter OTP sent to your ${field}`);
    if (otp) alert(`${field} verified`);
  };
  const handleSave = () => {
    const next = { ...stored, email, phone };
    try { localStorage.setItem('userProfile', JSON.stringify(next)); } catch {}
    navigate('/dashboard', { state: { userProfile: next } });
  };
  return (
    <div className="mop-page">
      <div className="mop-container">
        <div className="mop-layout">
          <main className="mop-main" style={{width:'100%'}}>
            <div className="mop-topbar">
              <button className="back-btn" onClick={() => navigate("/dashboard")}><FaArrowLeft /> Back to Dashboard</button>
              <button className="back-btn next-btn" onClick={() => navigate('/help')}>Go to Help</button>
            </div>
            <div className="mop-header">
              <div>
                <h1 className="mop-title" style={{margin:0}}>Account Settings</h1>
                <p className="mop-subtitle" style={{margin:0}}>Manage your account and billing</p>
              </div>
            </div>
            <form className="mop-grid" onSubmit={(e)=>{e.preventDefault();handleSave();}}>
              <div className="mop-section">
                <div className="mop-row"><label>Email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /><button className="back-btn" type="button" onClick={()=>handleVerify('email')} style={{marginLeft:'0.5rem'}}>Verify</button></div>
                <div className="mop-row"><label>Phone</label><input value={phone} onChange={(e)=>setPhone(e.target.value)} /><button className="back-btn" type="button" onClick={()=>handleVerify('phone')} style={{marginLeft:'0.5rem'}}>Verify</button></div>
                <div className="mop-actions"><button className="back-btn" type="submit">Save</button></div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

