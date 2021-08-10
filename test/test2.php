<?php


/**
 * Encryption class for encrypt/decrypt that works between programming languages.
 *
 * @author Vee Winch.
 * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
 */
class Encryption
{
    /**
     * @link http://php.net/manual/en/function.openssl-get-cipher-methods.php Available methods.
     * @var string Cipher method. Recommended AES-128-CBC, AES-192-CBC, AES-256-CBC
     */
    protected $encryptMethod = 'AES-256-CBC';


    /**
     * Decrypt string.
     *
     * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
     * @param string $encryptedString The encrypted string that is base64 encode.
     * @param string $key The key.
     * @return mixed Return original string value. Return null for failure get salt, iv.
     */
    public function decrypt($encryptedString, $key)
    {
        $json = json_decode(base64_decode($encryptedString), true);

        try {
            $salt = hex2bin($json["salt"]);
            $iv = hex2bin($json["iv"]);
        } catch (Exception $e) {
            return null;
        }

        $cipherText = base64_decode($json['ciphertext']);

        $iterations = intval(abs($json['iterations']));
        if ($iterations <= 0) {
            $iterations = 999;
        }
        $hashKey = hash_pbkdf2('sha512', $key, $salt, $iterations, ($this->encryptMethodLength() / 4));
        unset($iterations, $json, $salt);

        $decrypted = openssl_decrypt($cipherText, $this->encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);
        unset($cipherText, $hashKey, $iv);

        return $decrypted;
    }// decrypt


    /**
     * Encrypt string.
     *
     * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
     * @param string $string The original string to be encrypt.
     * @param string $key The key.
     * @return string Return encrypted string.
     */
    public function encrypt($string, $key)
    {
        $ivLength = openssl_cipher_iv_length($this->encryptMethod);
        $iv = openssl_random_pseudo_bytes($ivLength);

        $salt = openssl_random_pseudo_bytes(256);
        $iterations = 999;
        $hashKey = hash_pbkdf2('sha512', $key, $salt, $iterations, ($this->encryptMethodLength() / 4));

        $encryptedString = openssl_encrypt($string, $this->encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);

        $encryptedString = base64_encode($encryptedString);
        unset($hashKey);

        $output = ['ciphertext' => $encryptedString, 'iv' => bin2hex($iv), 'salt' => bin2hex($salt), 'iterations' => $iterations];
        unset($encryptedString, $iterations, $iv, $ivLength, $salt);

        return base64_encode(json_encode($output));
    }// encrypt


    /**
     * Get encrypt method length number (128, 192, 256).
     *
     * @return integer.
     */
    protected function encryptMethodLength()
    {
        $number = filter_var($this->encryptMethod, FILTER_SANITIZE_NUMBER_INT);

        return intval(abs($number));
    }// encryptMethodLength


    /**
     * Set encryption method.
     *
     * @link http://php.net/manual/en/function.openssl-get-cipher-methods.php Available methods.
     * @param string $cipherMethod
     */
    public function setCipherMethod($cipherMethod)
    {
        $this->encryptMethod = $cipherMethod;
    }// setCipherMethod


}

$nonceValue = 'nonce_value';// use nonce that generated while using OAuth.

$readableString = 'asdf-ghjk-qwer-tyui';
$encryptedString = 'eyJjaXBoZXJ0ZXh0IjoiNkRuSzRueVR5aERIQTVCdkF6SU9Mc0E0S1llUW5tZndvS0hIbERRMlE1VT0iLCJpdiI6IjNlNGU0YjFlNTBjNGRmODc2ZWExZTg3NjY3MDc4ZjBkIiwic2FsdCI6IjY0OWUxZDQ0NGNiZDc1YjBhODk2NmY2YTRjZTNjYzUzMmIyYTA4ZDQzZjlmYTQzNDRiOGU2MDFmNWIxODlkNzFjZGE3ZDc1YzU1YTBjMzNhMmM1ZWRlMjc5MTMxZTM5ZjNhYjgzY2JjNGQ5ZjIwYmY5YWE3YjdjN2MwNmVlMTZmNjJmYWEzMWU1MjFiMWZjNWFmZDcxMmRlNDQ3MWEyOTg3MDM0MzliODk0N2E0NGViOTMyMWFlMzI0ZWM2Zjg1ZjkwYmQzYzRmNjk5YzdmN2ViMTVhOGE0ZWExYjU1OGJmNWFiYjg5MzFjMjA5YTkzMWEwY2Q1NWM1NTgxMTRkNTY5NTIzZTk5OWMwZDA4Y2FiYmY4MzAzMTA0MzJkNzE2NmJlMDZlYzk3NjQzNzY1MzQ2NDI4YTM0ODM3MWUyOWRkNDU2ZTVmOGQ0NDgxZGVmZjY4M2FlOGYwOTJjODk3NjdhMzRhN2I0MWNlM2VlMDVlOWQ2ZDg4ZDI5MzVmZGM5MDUxY2VlZDhiYjllZDM5MzNjNjg2ODczZGNiOTJhZWI2MzBkMjNjODNhMjIyNTRjZDkxMDg4OTc4OWQ1MTI1MTc2MjQ2ZGYwOTQyODE5MTZlMmY4Y2RjYTU2MDEwMzEzZTM2NmE2ZDMyOTA4OGM3NzI5MWY3NDE3ODRiNTdmNTc1IiwiaXRlcmF0aW9ucyI6OTk5fQ==';


$Encryption = new Encryption();
$decrypted = $Encryption->decrypt('eyJjaXBoZXJ0ZXh0IjoiZG1zT3FBb2xMbXRBRUZ3V3UzMGpRUT09IiwiaXYiOiJlMWMwYzFmZTU2MDcxNjM4MGRjODE2MWUyZTNlOTM4ZSIsInNhbHQiOiI3MGEyOGViMmU5MmQ4YzZmZmMwYTAzYWY4NmU4ODdlN2RhMDMzNWE1NDkyZjVjMDU3MDEyNGUzMmI4OGVlNzJkZWIwYjljOGFjMGMwMjYzMTFjZWVmYzYwNGEzZWNmM2ZiMjQxYWZkYjM2YmYzZDljYmRhOWVjNjA2Y2YzMGViYTAzYjUwNTE3NjMyMTM0NmQ2MDZjM2UwMTZmNWI2YTRkNjdhY2QzYjVmMGRmYzYyODY5Nzg4MDI5N2FhNTEwMjA5NDYwNzNhNjMxM2VkYzJjMWU3NTk0NjE3Y2UyN2QzYmUxZjA1NGYyZDg2YTZhZTczNzEzYTI2NzVmYzc5OTQ0ZTM4MjI3MjcwMWEwOTBhMDViYWY3NTI3NTAzZjI0NjFhMWI0ODlmNTVjOWE2NGFhNzYzNDdjYTNiYWQwZjcwMGQwN2JiY2JmNDA4NjYxNWYzOTFkNTA4MzJjMzE0OTRjZTgxODUwZDc0Mzk1NmE4MjE5YzAyMDNhZWY4OWI5ZGIyODQ4MjgwNzk2NWZmYmRlZjc0ZTc3M2QxOTU5MWIwOTNiYWQ0ZDlhMjZkM2EwYjI5YzE3ZjhmY2FkZmRjNmIxOWViYzk0YWIxNmViOTI0NTMxNzE0M2ZiNzQ0ODRhNmM1N2JiOTJlN2QyOTllZjY0NjRjNTQ2Mjg1Njg5ZjExYiIsIml0ZXJhdGlvbnMiOjk5OX0=', '123123');
echo $decrypted;
