'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
var rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

function rentalPriceCalculator(rentals){
  var res = [];
  rentals.forEach(element => {
    
    // To set two dates to two variables 
    var datePick = new Date(element.pickupDate); 
    var dateRet = new Date(element.returnDate); 
    // To calculate the time difference of two dates 
    var Difference_In_Time = Math.abs(datePick.getTime() - dateRet.getTime()); 
    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
    var price = getCarPrice(cars,element.carId,Difference_In_Days,element.distance)
    price = getDescPrice(price,Difference_In_Days)
    if(element.options.deductibleReduction)
      element.price = price + 4*Difference_In_Days
    else
      element.price = price
    const result = res.filter(e => e.id == element.id);
    // we actualize the informartions about rentals
    if(result.length!=1){
      const post = {id : element.id, totalPrice : price}
      res.push(post)
    }
    else{
      result[0].totalPrice += price
    }

  })
  // we return the global price per driver
  return res;
}

function getCarPrice(cars,carId,ndays,km){
  const car = cars.filter(car => car.id == carId);
  var price = 0;
  if(car.length == 1){
    price = car[0].pricePerDay * ndays
    price += car[0].pricePerKm * km
  }
  return price
}

function getDescPrice(price, ndays){
  if(ndays>10){
    return price*0.5;
  }
  if(ndays>4){
    return price*0.7;
  }
  if(ndays>1){
    return price*0.9
  }
  return price
}

function rentalComissionCalculator(rentals){
  var res = [];
  rentals.forEach(element => {
    const result = rentals.filter(e => e.id == element.id);
    if(result.length!=0){
      // To set two dates to two variables 
      var datePick = new Date(element.pickupDate); 
      var dateRet = new Date(element.returnDate); 
      // To calculate the time difference of two dates 
      var Difference_In_Time = Math.abs(datePick.getTime() - dateRet.getTime()); 
      // To calculate the no. of days between two dates 
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
      
      // the real comm is without the additional charge of 4$/per day
      // we actualize this additionnal charge before this method
      // so per default, its value is 0. We have to deduce the additional charges of total price
      
      // comm is 30% of total price
      const comm =  (element.price-element.commission.virtuo) * 0.3;
      // insurance is half of commision
      element.commission.insurance += comm *0.5;
      // 1$ dollard of treasury per day
      element.commission.treasury += Difference_In_Days;
      // the rest for Virtuo
      if(element.options.deductibleReduction)
        element.commission.virtuo += comm * 0.5 +3*Difference_In_Days;
      else{
        element.commission.virtuo += comm * 0.5 - Difference_In_Days;
      }
    }
  });
}

function actorsDebitCredit(rentals,actors){
  rentals.forEach(rental => {
    const actIndex = actors.findIndex(act => act.rentalId== rental.id);
    actors[actIndex].payment[0].amount = rental.price
    actors[actIndex].payment[1].amount = rental.price*0.7
    actors[actIndex].payment[2].amount = rental.commission.insurance
    actors[actIndex].payment[3].amount = rental.commission.treasury
    actors[actIndex].payment[4].amount = rental.commission.virtuo
    console.log(actors[actIndex]) 
  })
}

rentalPriceCalculator(rentals)
rentalComissionCalculator(rentals)
actorsDebitCredit(rentals,actors)
