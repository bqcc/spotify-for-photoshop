"use strict";

const authbtn = document.querySelector(".authbtn");
const tokenbtn = document.querySelector(".tokenbtn");
const pausebtn = document.querySelector(".pausebtn");

const client_id = "08d490a86dc14c18a51a61ae2d2f06e4";
const client_secret = "aa48b20a1379446abe56764fb7c04d36";
const redirect_uri = "https://bqc.today/callback/";

authbtn.addEventListener("click", () =>
  window.open(
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-modify-playback-state`
  )
);

const code =
  "BQD_HyEUhu-u9G7Kzdchqr-LFYvP5g6it0PL60vn1MuAyKD9cJmGTARWUwHm-1kABxrvD60SnJTREODBuQvpRNEmF0X28ySGaJ7r_SOwHrkLvD2UZqedr4aAVMK2lphDwx6_Pebs4Ks-M0ekmQ6Jl_lmHZNwde93GCMcShSccA";

tokenbtn.addEventListener("click", async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + strToUTF8Base64(client_id + ":" + client_secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
  });
  const data = await res.json();
  console.log(data);
});

const access_token =
  "BQBpIFhVFBV64YbNIiUqQERkcHKjHpHVsaOTdpzaH82BX5W4Zbz5WZ4KqEdp-cLrg_NXRcllZIXe298J3_74s0cef62UQwhRIu0PCq5LIeQqMlTHXYXsAn6SnPcJWhW1X1TOC68UhqtGRP-Vf-ILr8sy3veCepFjPaI50k3XXg";

pausebtn.addEventListener("click", async () => {
  const res = await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await res.json();
  console.log(data);
});

/////////////////////////////////
function strToUTF8Base64(str) {
  function decodeSurrogatePair(hi, lo) {
    var resultChar = 0x010000;
    resultChar += lo - 0xdc00;
    resultChar += (hi - 0xd800) << 10;
    return resultChar;
  }

  var bytes = [0, 0, 0];
  var byteIndex = 0;
  var result = [];

  function output(s) {
    result.push(s);
  }

  function emitBase64() {
    var digits =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789+/";

    function toDigit(value) {
      return digits[value];
    }

    // --Byte 0--    --Byte 1--    --Byte 2--
    // 1111  1122    2222  3333    3344  4444

    var d1 = toDigit(bytes[0] >> 2);
    var d2 = toDigit(((bytes[0] & 0x03) << 4) | (bytes[1] >> 4));
    var d3 = toDigit(((bytes[1] & 0x0f) << 2) | (bytes[2] >> 6));
    var d4 = toDigit(bytes[2] & 0x3f);

    if (byteIndex === 1) {
      output(d1 + d2 + "==");
    } else if (byteIndex === 2) {
      output(d1 + d2 + d3 + "=");
    } else {
      output(d1 + d2 + d3 + d4);
    }
  }

  function emit(chr) {
    bytes[byteIndex++] = chr;
    if (byteIndex == 3) {
      emitBase64();
      bytes[0] = 0;
      bytes[1] = 0;
      bytes[2] = 0;
      byteIndex = 0;
    }
  }

  function emitLast() {
    if (byteIndex > 0) {
      emitBase64();
    }
  }

  // Converts the string to UTF8:

  var i, chr;
  var hi, lo;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);

    // Test and decode surrogate pairs in the string
    if (chr >= 0xd800 && chr <= 0xdbff) {
      hi = chr;
      lo = str.charCodeAt(i + 1);
      if (lo >= 0xdc00 && lo <= 0xdfff) {
        chr = decodeSurrogatePair(hi, lo);
        i++;
      }
    }

    // Encode the character as UTF-8.
    if (chr < 0x80) {
      emit(chr);
    } else if (chr < 0x0800) {
      emit((chr >> 6) | 0xc0);
      emit(((chr >> 0) & 0x3f) | 0x80);
    } else if (chr < 0x10000) {
      emit((chr >> 12) | 0xe0);
      emit(((chr >> 6) & 0x3f) | 0x80);
      emit(((chr >> 0) & 0x3f) | 0x80);
    } else if (chr < 0x110000) {
      emit((chr >> 18) | 0xf0);
      emit(((chr >> 12) & 0x3f) | 0x80);
      emit(((chr >> 6) & 0x3f) | 0x80);
      emit(((chr >> 0) & 0x3f) | 0x80);
    }
  }

  emitLast();

  return result.join("");
}
