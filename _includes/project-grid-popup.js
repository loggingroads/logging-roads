['<h2>Task Number: <strong>', layer.feature['id'], '</strong></h2>',
  '<ul>',
    '<li>Task Status > <strong>', cell_state, '</strong></li>',
    '<li>Task State > <strong>', locked_state, '</strong></li>',
  '</ul>',
  '<p><small>Click to start mapping with the Tasking Manager</small></p>'].join(' ')

{% comment %}
['<h2>Task Number: <strong>', layer.feature['id'], '</strong></h2>',
  '<table>',
    '<tr>',
      '<td>Task Status</td>', '<td> > </td>', '<td><strong>', cell_state, '</strong></td>',
    '</tr>',
    '<tr>',
      '<td>Task State</td>', '<td> > </td>', '<td><strong>', locked_state, '</strong></td>',
    '</tr>',
  '</table>',
  '<p><small>Click to start mapping with the Tasking Manager</small></p>'].join(' ');
{% endcomment %}
