import { TestBed } from '@angular/core/testing';

import { WikipediaApiService } from './wikipedia-api.service';

describe('WikipediaApiService', () => {
  let service: WikipediaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikipediaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
