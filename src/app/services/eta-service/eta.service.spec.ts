import { TestBed, inject } from '@angular/core/testing';

import { EtaService } from './eta.service';

describe('EtaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EtaService]
    });
  });

  it('should be created', inject([EtaService], (service: EtaService) => {
    expect(service).toBeTruthy();
  }));
});
