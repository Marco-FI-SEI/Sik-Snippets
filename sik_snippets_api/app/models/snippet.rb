class Snippet < ApplicationRecord
  belongs_to :snippet_category

  validates_presence_of :title
  # validates_presence_of :title, :body
end
