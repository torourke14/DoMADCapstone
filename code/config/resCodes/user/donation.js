resCode = {
  saveDonation:{
    success:{
      status:201,
      message:'Donation added successfully'
    },
    addDonationFail:{
      status:400,
      message:'Failed to save new donation in database'
    }
  },
  deleteDonation:{
    success:{
      status:200,
      message:'Donation successfully deleted'
    },
    donationNotFound:{
      status:404,
      message:'No donation with this ID was found'
    },
    deleteDonationFail:{
      status:400,
      message:'Failed to delete donation by ID',
    }
  }
}

module.exports = resCode;
