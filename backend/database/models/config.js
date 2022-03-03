/**
 * Config database schema.
 */
module.exports = mongoose => {
 let configScheme = mongoose.Schema({
  spendThreshold: {
   type: Number,
  },
  monthlySpendThreshold: {
   type: Number,
  },
  totalMonthlySpend: {
   type: Number
  }
 })
 
 return mongoose.model(
   "config",
   configScheme
 )
}