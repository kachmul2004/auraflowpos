// Browser localStorage wrapper for Kotlin/Wasm
// Export as a module for @JsModule import

export default {
    setItem: (key, value) => {
        try {
            console.log(`💾 WASM JS: Saving ${key}`);
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('localStorage.setItem failed:', e);
            throw e;
        }
    },
    
    getItem: (key) => {
        try {
            const result = localStorage.getItem(key);
            console.log(`📖 WASM JS: Reading ${key}: ${result?.substring(0, 50)}`);
            return result;
        } catch (e) {
            console.error('localStorage.getItem failed:', e);
            return null;
        }
    },
    
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('localStorage.removeItem failed:', e);
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('localStorage.clear failed:', e);
        }
    }
};
