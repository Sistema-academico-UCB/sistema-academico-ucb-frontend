import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfFriendsComponent } from './list-of-friends.component';

describe('ListOfFriendsComponent', () => {
  let component: ListOfFriendsComponent;
  let fixture: ComponentFixture<ListOfFriendsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfFriendsComponent]
    });
    fixture = TestBed.createComponent(ListOfFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
