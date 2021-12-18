import { Injectable } from '@angular/core';

Injectable()
export class AppConstants {


  public GRADELEVEL = [ 'K4','K5','01','02','03','04','05','06','07','08','09','10','11','12'];
  public SCHOOLYEAR = [
    { year:"2018", longyr:"2018-2019"},
    { year:"2019", longyr:"2018-2019"},
    { year:"2020",longyr:"2019-2020"},
    { year:"2021",longyr:"2020-2021"},
    { year:"2022",longyr:"2021-2022"},
    { year:"2023",longyr:"2022-2023"},
    { year:"2024",longyr:"2023-2024"}, 
    { year:"2025",longyr:"2024-2025"},
    { year:"2026",longyr:"2025-2026"}, 
    { year:"2027",longyr:"2026-2027"},
    { year:"2028",longyr:"2027-2028"} 
  
  
  ];

  public PERIODNUMBERS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]

  public DAILYSECONDS = (1000 * 3600 * 24)





}
