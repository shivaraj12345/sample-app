const EstablishmentSchema = {
    name: 'Establishment',
    primaryKey: 'Id',
    properties:
    {
        Id: 'string', 
        ADCCNumber: {type: 'string', optional: true},
        ArabicName: {type: 'string', optional: true},
        ADFCAIntialTradeLicense: {type: 'string', optional: true},
        Mobile: {type: 'string', optional: true},
        PreferredLanguage: {type: 'string', optional: true},
        LicenseExpiryDate: {type: 'string', optional: true},
        LicenseNumber: {type: 'string', optional: true},
        LicenseRegDate: {type: 'string', optional: true},
        AccountNumber: {type: 'string', optional: true},
        AccountRegion: {type: 'string', optional: true},
        Status: {type: 'string', optional: true},
        AccountClass: {type: 'string', optional: true},
        Alias: {type: 'string', optional: true},
        BankCode: {type: 'string', optional: true},
        EHSRiskClassification: {type: 'string', optional: true},
        LicenseCode: {type: 'string', optional: true},
        Sent: {type: 'string', optional: true},
        URL: {type: 'string', optional: true},
        OnHold: {type: 'string', optional: true},
        Reference: {type: 'string', optional: true},
        LegalStatus: {type: 'string', optional: true},
        Site: {type: 'string', optional: true},
        Email: {type: 'string', optional: true},
        MainFaxNumber: {type: 'string', optional: true},
        LandlineNumber: {type: 'string', optional: true},
        Area: {type: 'string', optional: true},
        Sector: {type: 'string', optional: true},
        City: {type: 'string', optional: true},
        EnglishName: {type: 'string', optional: true},
        AccountCategory: {type: 'string', optional: true},
        Parent: {type: 'string', optional: true},
        LicenseSource: {type: 'string', optional: true},
        AccountType: {type: 'string', optional: true},
        PrimaryAddressId: {type: 'string', optional: true},
        NumofWH: {type: 'string', optional: true},
        NumofSheds: {type: 'string', optional: true},
        NumofFishPonds: {type: 'string', optional: true},
        CapofWH: {type: 'string', optional: true},
        CapofSheds: {type: 'string', optional: true},
        CapofFishPonds: {type: 'string', optional: true},
        ADFCAAgrEstGrade: {type: 'string', optional: true},
        isUploaded: {type: 'string', optional: true},
        addressObj :  {type: 'string', optional: true},
    }
};
export default EstablishmentSchema;