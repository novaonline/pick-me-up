import { TestBed, inject } from '@angular/core/testing';

import { SocketConnectionService } from './socket-connection.service';

describe('SocketConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketConnectionService]
    });
  });

  it('should be created', inject([SocketConnectionService], (service: SocketConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
