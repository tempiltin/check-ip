const express = require("express"); 
const axios = require("axios"); 
const requestIp = require("request-ip"); 
require("dotenv").config();

const router = express.Router(); 

const VPN_API_KEY = process.env.VPN_API_KEY;


router.get("/check-ip", async (req, res) => {
    try {
 
        const clientIp = req.headers["x-forwarded-for"] || requestIp.getClientIp(req) || "0.0.0.0";
        const cleanIp = clientIp.split(",")[0].trim(); // IP ni tozalash

        console.log(`🕵️ IP tekshirilmoqda: ${cleanIp}`);

        const vpnResponse = await axios.get(`https://vpnapi.io/api/${cleanIp}?key=${VPN_API_KEY}`);


        if (!vpnResponse.data || !vpnResponse.data.security) {
            return res.status(500).json({ status: 500, msg: "VPN API javobi noto‘g‘ri" });
        }

        const isVpn = vpnResponse.data.security.vpn || vpnResponse.data.security.proxy;

  
        if (isVpn) {
            return res.status(403).json({ status: 403, msg: "VPN ishlatilmoqda" });
        }

        res.status(200).json({
            status: 200,
            ip: vpnResponse.data.ip,
            country: vpnResponse.data.location.country,
            city: vpnResponse.data.location.city,
            msg: "IP manzili muvaffaqiyatli tekshirildi"
        });
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error.message);
        res.status(500).json({ status: 500, msg: "Xatolik yuz berdi" });
    }
});

module.exports = router; 
