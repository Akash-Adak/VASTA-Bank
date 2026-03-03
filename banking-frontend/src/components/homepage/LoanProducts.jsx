import React, { useState, useEffect, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const loanTypes = [
  {
    id: 1,
    name: "Personal Loan",
    icon: "fas fa-user",
    minAmount: 50000,
    maxAmount: 5000000,
    defaultAmount: 1000000,
    minTenure: 1,
    maxTenure: 5,
    defaultTenure: 4,
    minRate: 10.5,
    maxRate: 21,
    defaultRate: 15,
    description: "Quick funds for personal needs with instant approval",
    applyLink: "/",
    knowMoreLink: "/personal-loan"
  },
  {
    id: 2,
    name: "Home Loan",
    icon: "fas fa-home",
    minAmount: 100000,
    maxAmount: 100000000,
    defaultAmount: 4500000,
    minTenure: 1,
    maxTenure: 50,
    defaultTenure: 25,
    minRate: 0.5,
    maxRate: 15,
    defaultRate: 8.75,
    description: "Build your dream home with long tenure and flexible options",
    applyLink: "/",
    knowMoreLink: "/home-loan"
  },
  {
    id: 3,
    name: "Car Loan",
    icon: "fas fa-car",
    minAmount: 100000,
    maxAmount: 1900000,
    defaultAmount: 1000000,
    minTenure: 1,
    maxTenure: 8,
    defaultTenure: 7,
    minRate: 5,
    maxRate: 20,
    defaultRate: 8.7,
    description: "Drive your dream car with competitive interest rates",
    applyLink: "/",
    knowMoreLink: "/car-loan"
  },
  {
    id: 4,
    name: "Loan Against Property",
    icon: "fas fa-landmark",
    minAmount: 1100000,
    maxAmount: 100000000,
    defaultAmount: 1100000,
    minTenure: 1,
    maxTenure: 15,
    defaultTenure: 15,
    minRate: 10.1,
    maxRate: 10.6,
    defaultRate: 10.5,
    description: "Leverage your property value for substantial funds",
    applyLink: "/p",
    knowMoreLink: "/loan-against-property"
  }
 
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const formatCurrencyFull = (value) => {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
};

export default function LoanCalculator() {
  const [activeLoan, setActiveLoan] = useState(loanTypes[0]);
  const [loanAmount, setLoanAmount] = useState(loanTypes[0].defaultAmount);
  const [loanTenure, setLoanTenure] = useState(loanTypes[0].defaultTenure);
  const [interestRate, setInterestRate] = useState(loanTypes[0].defaultRate);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputFields, setInputFields] = useState({
    amount: loanTypes[0].defaultAmount.toString(),
    tenure: loanTypes[0].defaultTenure.toString(),
    rate: loanTypes[0].defaultRate.toString()
  });

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const annualRate = interestRate;
    const months = loanTenure * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    if (monthlyRate === 0) {
      return principal / months;
    }
    
    const emiValue = principal * monthlyRate * 
      Math.pow(1 + monthlyRate, months) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    return emiValue;
  };

  // Update calculations when values change
  useEffect(() => {
    const calculatedEmi = calculateEMI();
    const totalMonths = loanTenure * 12;
    const calculatedTotalAmount = calculatedEmi * totalMonths;
    const calculatedTotalInterest = calculatedTotalAmount - loanAmount;
    
    setEmi(calculatedEmi);
    setTotalInterest(calculatedTotalInterest);
    setTotalAmount(calculatedTotalAmount);
  }, [loanAmount, loanTenure, interestRate]);

  // Handle loan type change
  const handleLoanChange = (loan) => {
    setActiveLoan(loan);
    setLoanAmount(loan.defaultAmount);
    setLoanTenure(loan.defaultTenure);
    setInterestRate(loan.defaultRate);
    setInputFields({
      amount: loan.defaultAmount.toString(),
      tenure: loan.defaultTenure.toString(),
      rate: loan.defaultRate.toString()
    });
  };

  // Handle manual input changes
  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    let clampedValue = numValue;
    
    switch(field) {
      case 'amount':
        clampedValue = Math.max(activeLoan.minAmount, Math.min(activeLoan.maxAmount, numValue));
        setLoanAmount(clampedValue);
        break;
      case 'tenure':
        clampedValue = Math.max(activeLoan.minTenure, Math.min(activeLoan.maxTenure, numValue));
        setLoanTenure(clampedValue);
        break;
      case 'rate':
        clampedValue = Math.max(activeLoan.minRate, Math.min(activeLoan.maxRate, numValue));
        setInterestRate(clampedValue);
        break;
    }
    
    setInputFields(prev => ({
      ...prev,
      [field]: clampedValue.toString()
    }));
  };

  // Handle slider changes
  const handleSliderChange = (field, value) => {
    switch(field) {
      case 'amount':
        setLoanAmount(value);
        setInputFields(prev => ({ ...prev, amount: value.toString() }));
        break;
      case 'tenure':
        setLoanTenure(value);
        setInputFields(prev => ({ ...prev, tenure: value.toString() }));
        break;
      case 'rate':
        setInterestRate(value);
        setInputFields(prev => ({ ...prev, rate: value.toString() }));
        break;
    }
  };

  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white font-sans" id="calculatorSEO">
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 hidden lg:block">
        <img 
          src="https://s7ap1.scene7.com/is/content/hdfcbankPWS/calc_right_pattern?fmt=webp-alpha" 
          alt="pattern shape" 
          className="w-64 opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 aos-init" data-aos="fade-up">
  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
    Plan Your Finances <br className="hidden md:block" />
    <span className="text-blue-900">With Precision</span>
  </h2>
  <p className="text-xl text-gray-600">
    Smart tools for smarter financial decisions
  </p>
</div>

        {/* Main Calculator Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Loan Type Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {loanTypes.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => handleLoanChange(loan)}
                  className={`flex-shrink-0 px-6 py-4 flex items-center gap-3 transition-all ${
                    activeLoan.id === loan.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ minWidth: '200px' }}
                >
                  <i className={`${loan.icon} text-lg`}></i>
                  <span className="font-bold text-base">{loan.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-8" data-aos="fade-up">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {activeLoan.name} Calculator
                  </h3>
                  <p className="text-gray-600">{activeLoan.description}</p>
                </div>

                {/* Loan Amount */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-900 uppercase">
                      Loan Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">₹</span>
                      <input
                        type="text"
                        value={formatCurrencyFull(loanAmount)}
                        onChange={(e) => handleInputChange('amount', e.target.value.replace(/,/g, ''))}
                        className="w-40 bg-gray-50 border border-gray-300 rounded-lg py-2 pl-8 pr-4 text-right font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <Slider
                    min={activeLoan.minAmount}
                    max={activeLoan.maxAmount}
                    step={10000}
                    value={loanAmount}
                    onChange={(value) => handleSliderChange('amount', value)}
                    trackStyle={{ backgroundColor: '#1e40af', height: 6 }}
                    railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                    handleStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#1e40af',
                      borderWidth: 3,
                      height: 24,
                      width: 24,
                      marginTop: -9,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹ {formatCurrency(activeLoan.minAmount)}</span>
                    <span>₹ {formatCurrency(activeLoan.maxAmount)}</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-900 uppercase">
                      Loan Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loanTenure}
                        onChange={(e) => handleInputChange('tenure', e.target.value)}
                        className="w-20 bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600">
                        {loanTenure === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>
                  </div>
                  <Slider
                    min={activeLoan.minTenure}
                    max={activeLoan.maxTenure}
                    step={1}
                    value={loanTenure}
                    onChange={(value) => handleSliderChange('tenure', value)}
                    trackStyle={{ backgroundColor: '#1e40af', height: 6 }}
                    railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                    handleStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#1e40af',
                      borderWidth: 3,
                      height: 24,
                      width: 24,
                      marginTop: -9,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{activeLoan.minTenure} {activeLoan.minTenure === 1 ? 'Year' : 'Years'}</span>
                    <span>{activeLoan.maxTenure} Years</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-900 uppercase">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={interestRate.toFixed(2)}
                        onChange={(e) => handleInputChange('rate', e.target.value)}
                        className="w-24 bg-gray-50 border border-gray-300 rounded-lg py-2 px-8 text-right font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                    </div>
                  </div>
                  <Slider
                    min={activeLoan.minRate}
                    max={activeLoan.maxRate}
                    step={0.01}
                    value={interestRate}
                    onChange={(value) => handleSliderChange('rate', value)}
                    trackStyle={{ backgroundColor: '#1e40af', height: 6 }}
                    railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                    handleStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#1e40af',
                      borderWidth: 3,
                      height: 24,
                      width: 24,
                      marginTop: -9,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{activeLoan.minRate}% p.a.</span>
                    <span>{activeLoan.maxRate}% p.a.</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-8" data-aos="fade-up" data-aos-delay="100">
                {/* EMI Display */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-8 text-white">
                  <p className="text-sm opacity-90">Your Monthly EMI will be</p>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl mr-1">₹</span>
                    <span className="text-4xl md:text-5xl font-bold">
                      {formatCurrencyFull(emi)}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs opacity-80">Amount Payable</p>
                      <p className="text-lg font-bold mt-1">₹ {formatCurrencyFull(totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Interest Amount</p>
                      <p className="text-lg font-bold mt-1">₹ {formatCurrencyFull(totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Principal Amount</p>
                      <p className="text-lg font-bold mt-1">₹ {formatCurrencyFull(loanAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={activeLoan.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <span>Apply Now</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <a
                    href={activeLoan.knowMoreLink}
                    className="flex-1 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Know More</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>

                {/* EMI Breakdown */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">EMI Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Monthly EMI</span>
                        <span>₹ {formatCurrencyFull(emi)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Principal Amount</span>
                        <span>₹ {formatCurrencyFull(loanAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(loanAmount / totalAmount * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Total Interest</span>
                        <span>₹ {formatCurrencyFull(totalInterest)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(totalInterest / totalAmount * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

            
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}