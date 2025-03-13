/**
 * Standart API yanıtlarını format eder
 */
class ResponseFormatter {
    /**
     * Başarılı bir yanıt oluşturur
     * @param {*} data - Yanıt verileri
     * @param {string} message - Opsiyonel mesaj
     * @returns {Object} Biçimlendirilmiş başarı yanıtı
     */
    success(data, message = 'İşlem başarılı') {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * Hata yanıtı oluşturur
     * @param {string} message - Hata mesajı
     * @param {*} errors - Detaylı hata bilgileri (opsiyonel)
     * @returns {Object} Biçimlendirilmiş hata yanıtı
     */
    error(message = 'Bir hata oluştu', errors = null) {
        const response = {
            success: false,
            message
        };

        if (errors) {
            response.errors = errors;
        }

        return response;
    }
}

export const responseFormatter = new ResponseFormatter();